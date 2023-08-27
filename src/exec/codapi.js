// Execute code using the Codapi sandbox server.

const defaultUrl = "https://api.codapi.org/v1";
const defaultErrMsg = "Something is wrong with Codapi.";
const networkErrMsg = "Either Codapi is down or there is a network problem.";

const errors = {
    400: "Bad request. Something is wrong with the request, not sure what.",
    403: "Forbidden. Your domain is probably not allowed on Codapi.",
    413: "Request is too large. Try submitting less code.",
    429: "Too many requests. Try again in a few seconds.",
};

// exec executes a specific command
// using a sandbox server API.
async function exec(apiUrl, data) {
    try {
        const url = `${apiUrl || defaultUrl}/exec`;
        const resp = await fetch(url, {
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
        return {
            ok: false,
            duration: 0,
            stdout: networkErrMsg,
            stderr: `(${exc})`,
        };
    }
}

export default { exec };
