// Execute user code.

import codobj from "./codobj.js";
import codapi from "./engine/codapi.js";
import browser from "./engine/browser.js";
import text from "./text.js";

const defaultEngine = "codapi";
const defaultCommand = "run";

// Executor runs the code and shows the results.
class Executor {
    constructor({ engine, sandbox, command, url, template, files }) {
        const [sandboxName, version] = text.cut(sandbox, ":");
        this.engineName = engine || defaultEngine;
        this.sandbox = sandboxName;
        this.version = version;
        this.command = command || defaultCommand;
        this.url = url;
        this.template = template;
        this.files = files;
    }

    // engine returns the engine for the command.
    get engine() {
        const instance = codobj.engines[this.engineName];
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
        code = template.replace(placeholder, () => code);
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
codobj.engines = { ...codobj.engines, ...engines };

export { Executor };
