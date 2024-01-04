// Execute user code.

import codapi from "./engine/codapi.js";
import browser from "./engine/browser.js";
import text from "./text.js";

const defaultCommand = "run";

// Executor runs the code and shows the results.
class Executor {
    constructor({ sandbox, command, url, template, files }) {
        const [engineName, sandboxName, version] = parseSandbox(sandbox);
        this.engineName = engineName;
        this.sandbox = sandboxName;
        this.version = version;
        this.command = command || defaultCommand;
        this.url = url;
        this.template = template;
        this.files = files;
    }

    // engine returns the engine for the command.
    get engine() {
        const instance = window.Codapi.engines[this.engineName];
        if (!instance) {
            throw new Error(`unknown engine: ${this.engineName}`);
        }
        return instance;
    }

    // execute runs the code and shows the results.
    async execute(command, code) {
        code = await this.prepare(code);
        const files = await this.loadFiles();
        const result = await this.engine.exec(this.url, {
            sandbox: this.sandbox,
            version: this.version,
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
        const [_, template] = await readFile(this.template, encodeText);
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
            const [name, file] = await readFile(path, encodeResponse);
            files[name] = file;
        }
        return files;
    }
}

// parseSandbox returns the engine name, sandbox name, and sandbox version
// based on the source sandbox string. For example:
//     "python"      -> ["codapi", "python", ""]
//     "python:dev"  -> ["codapi", "python", "dev"]
//     "javascript"  -> ["javascript", "javascript", ""]
//     "wasi/python" -> ["wasi", "python", ""]
function parseSandbox(sandbox) {
    const [engine, sandboxWithVersion] = sandbox.includes("/")
        ? text.cut(sandbox, "/")
        : ["codapi", sandbox];
    const [sandboxName, version] = text.cut(sandboxWithVersion, ":");
    return [engine, sandboxName, version];
}

// readFile loads file content from either a `script` element
// or an external file and returns its serialized value.
async function readFile(path, encodeFunc) {
    if (path[0] == "#") {
        // get `script` by id and return its content
        const name = path.slice(1);
        const el = document.getElementById(name);
        if (!el) {
            throw new Error(`element ${path} not found`);
        }
        return [name, el.text];
    }
    // read external file
    const name = path.split("/").pop();
    const resp = await fetch(path);
    if (resp.status != 200) {
        throw new Error(`file ${path} not found`);
    }
    const data = await encodeFunc(resp);
    return [name, data];
}

// encodeText serializes response content as text.
async function encodeText(resp) {
    return await resp.text();
}

// encodeResponse serializes response content
// according to the content type, either as text
// or as a data-url encoded binary value.
async function encodeResponse(resp) {
    const contentType = resp.headers.get("content-type");
    if (contentType == "application/octet-stream") {
        const blob = await resp.blob();
        return await asDataURL(blob);
    } else {
        return await resp.text();
    }
}

// asDataURL encodes a Blob value as a data URL.
function asDataURL(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            resolve(reader.result);
        };
    });
}

// built-in engines
const engines = {
    codapi: codapi,
    browser: browser,
};

// add engines to the registry
window.Codapi = window.Codapi || {};
window.Codapi.engines = { ...window.Codapi.engines, ...engines };

export { Executor };
