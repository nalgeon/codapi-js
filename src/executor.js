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
    constructor({ sandbox, command, url, template, files }) {
        this.sandbox = sandbox;
        this.command = command || defaultCommand;
        this.url = url;
        this.template = template;
        this.files = files;
        this.execFunc = execMap[sandbox] || codapi.exec;
    }

    // execute runs the code and shows the results.
    async execute(command, code) {
        code = await this.prepare(code);
        const files = await this.loadFiles();
        const result = await this.execFunc(this.url, {
            sandbox: this.sandbox,
            command: command || this.command,
            files: {
                "": code,
                ...files,
            },
        });
        return result;
    }

    // prepare preprocesses code before execution.
    async prepare(code) {
        if (!this.template) {
            return code;
        }
        const placeholder = "##CODE##";
        const [_, template] = await readFile(this.template);
        code = template.replace(placeholder, code);
        return code;
    }

    // loadFiles loads additional code files.
    async loadFiles() {
        if (!this.files) {
            return {};
        }
        const files = {};
        for (let path of this.files) {
            const [name, file] = await readFile(path);
            files[name] = file;
        }
        return files;
    }
}

// readFile loads file content from either a `script` element
// or an external file and returns it as text.
async function readFile(path) {
    try {
        if (path[0] == "#") {
            // get `script` by id and return its content
            const name = path.slice(1);
            const text = document.getElementById(name).text;
            return [name, text];
        }
        // read external file
        const name = path.split("/").pop();
        const resp = await fetch(path);
        const text = await resp.text();
        return [name, text];
    } catch (err) {
        throw new Error(`file ${path} not found`, { cause: err });
    }
}
export { Executor };
