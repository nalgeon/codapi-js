// Execute code using the Codapi sandbox server.
import { codobj } from "../codobj.js";
import { fetchTimeout } from "../http.js";

const defaultUrl = "https://api.codapi.org/v1";
const defaultErrMsg = "Something is wrong with Codapi.";

const probeInterval = 30 * 1000; // 30 seconds
const probeTimeout = 1000; // 1 second

const errors = {
    400: "Bad request. Something is wrong with the request, not sure what.",
    404: "Unknown sandbox or command.",
    403: "Forbidden. Your domain is probably not allowed on Codapi.",
    413: "Request is too large. Try submitting less code.",
    429: "Too many requests. Try again in a few seconds.",
};

const serverHealth = {
    isUp: false,
    lastChecked: 0,
};

// exec executes a specific command
// using a sandbox server API.
async function exec(data) {
    try {
        await probe();
        return await execCode(data);
    } catch (exc) {
        // Network or server failure. Not returning the result object,
        // as we should handle such errors differently (e.g. show fallback)
        throw new Error(`request failed`, { cause: exc });
    }
}

// probe checks if the sandbox server is up.
// Throws an error if the server is down.
async function probe() {
    const now = Date.now();
    const probeDue = now - serverHealth.lastChecked > probeInterval;
    if (serverHealth.isUp && !probeDue) {
        // Cache "up" status for probeInterval duration.
        return true;
    }
    // Do not cache "down" status, always probe.
    try {
        const url = `${codobj.settings.url || defaultUrl}/health`;
        const resp = await fetchTimeout(url, {
            method: "HEAD",
            timeout: probeTimeout,
        });
        serverHealth.lastChecked = now;
        serverHealth.isUp = resp.ok;
    } catch {
        serverHealth.lastChecked = now;
        serverHealth.isUp = false;
        throw new Error("server is down");
    }
}

// execCode executes code using the sandbox server.
async function execCode(data) {
    const url = `${codobj.settings.url || defaultUrl}/exec`;
    const resp = await fetchTimeout(url, {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!resp.ok) {
        const msg = errors[resp.status] || defaultErrMsg;
        return {
            ok: false,
            duration: 0,
            stdout: "",
            stderr: `${resp.status} - ${msg}`,
        };
    }
    return await resp.json();
}

export default { init: () => {}, exec };
