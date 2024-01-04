// Execute code using browser APIs.

import http from "./http.js";
import js from "./javascript.js";

// sandbox command executors
const executors = {
    javascript: js.exec,
    fetch: http.exec,
};

// exec executes a specific command using the appropriate browser API.
async function exec(url, req) {
    try {
        const executor = getExecutor(req);
        return executor(url, req);
    } catch (exc) {
        return {
            ok: false,
            duration: 0,
            stdout: "",
            stderr: exc.toString(),
        };
    }
}

// getExecutor returns the executor that matches the request.
function getExecutor(req) {
    if (!(req.sandbox in executors)) {
        throw Error(`unknown sandbox: ${req.sandbox}`);
    }
    if (req.command != "run") {
        throw Error(`unknown command: ${req.sandbox}.${req.command}`);
    }
    return executors[req.sandbox];
}

export default { init: () => {}, exec };
