// Execute code using the sandbox server API.

const defaultCommand = "run";
const defaultUrl = "https://api.codapi.org/v1";
const defaultErrMsg = "Something is wrong with Codapi.";
const networkErrMsg = "Either Codapi is down or there is a network problem.";

const errors = {
    400: "Bad request. Something is wrong with the request, not sure what.",
    403: "Forbidden. Your domain is probably not allowed on Codapi.",
    413: "Request is too large. Try submitting less code.",
    429: "Too many requests. Try again in a few seconds.",
};

// An Executor runs the code and shows the results.
class Executor {
    constructor({ sandbox, command, template, url }) {
        this.sandbox = sandbox;
        this.command = command || defaultCommand;
        this.template = template;
        this.apiUrl = url || defaultUrl;
    }

    // execute runs the code and shows the results.
    async execute(code) {
        code = await this.prepare(code);
        const result = await exec(this.apiUrl, {
            sandbox: this.sandbox,
            command: this.command,
            files: {
                "": code,
            },
        });
        return result;
    }

    // prepare preprocesses code before execution.
    async prepare(code) {
        if (!this.template) {
            return Promise.resolve(code);
        }
        const placeholder = "##CODE##";
        const template = await readFile(this.template);
        code = template.replace(placeholder, code);
        return code;
    }
}

// readFile fetches the remote file
// and returns its contents as text.
async function readFile(path) {
    const resp = await fetch(path);
    return await resp.text();
}

// exec executes a specific command
// using a sandbox server API.
async function exec(apiUrl, data) {
    try {
        const url = `${apiUrl}/exec`;
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

export { Executor };
