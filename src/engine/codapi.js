// Execute code using the Codapi sandbox server.
import { codobj } from "../codobj.js";
import { fetchTimeout } from "../http.js";

const defaultUrl = "https://api.codapi.org/v1";
const defaultErrMsg = "Something is wrong with Codapi.";

const errors = {
    400: "Bad request. Something is wrong with the request, not sure what.",
    404: "Unknown sandbox or command.",
    403: "Forbidden. Your domain is probably not allowed on Codapi.",
    413: "Request is too large. Try submitting less code.",
    429: "Too many requests. Try again in a few seconds.",
};

// exec executes a specific command
// using a sandbox server API.
async function exec(data) {
    try {
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
    } catch (exc) {
        // Network or server failure. Not returning the result object,
        // as we should handle such errors differently (e.g. show fallback)
        throw new Error(`request failed`, { cause: exc });
    }
}

export default { init: () => {}, exec };
