// Execute user code.

import js from "./exec/javascript.js";
import codapi from "./exec/codapi.js";
import http from "./exec/http.js";

const defaultCommand = "run";

// special-case executors
// the default one is codapi.exec
const execMap = {
    javascript: js.exec,
    fetch: http.exec,
};

// An Executor runs the code and shows the results.
class Executor {
    constructor({ sandbox, command, template, url }) {
        this.sandbox = sandbox;
        this.command = command || defaultCommand;
        this.template = template;
        this.url = url;
        this.execFunc = execMap[sandbox] || codapi.exec;
    }

    // execute runs the code and shows the results.
    async execute(code) {
        code = await this.prepare(code);
        const result = await this.execFunc(this.url, {
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

export { Executor };
