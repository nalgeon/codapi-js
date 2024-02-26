// Execute code using the Runno WASI runtime.

import { codobj } from "../codobj.js";
import boxes from "./wasi/boxes.js";
import commands from "./wasi/commands.js";

const { WASI } = window.Runno;
const programs = {};

// base URL (absolute or relative) for loading WASI binaries,
// without the trailing slash.
const basePath = new URL(getScriptUrl()).searchParams.get("path");

// init downloads (if necessary) and returns a WASI binary by name.
async function init(name) {
    if (!(name in boxes)) {
        throw Error(`unknown box: ${name}`);
    }
    if (name in programs) {
        return programs[name];
    }
    const box = boxes[name];
    const path = basePath || box.path;
    const bytes = await readFile(`${path}/${box.file}`);
    programs[name] = () =>
        new Response(bytes, {
            status: 200,
            headers: { "content-type": "application/wasm" },
        });
    return programs[name];
}

// exec executes a specific command using a WASI binary.
async function exec(req) {
    try {
        let output;
        const cmd = getCommand(req);
        for (const step of cmd.steps) {
            prepareRequest(step, req);
            output = await execStep(step, req);
            if (!output.ok) {
                break;
            }
        }
        return output;
    } catch (exc) {
        return {
            ok: false,
            duration: 0,
            stdout: "",
            stderr: exc.toString(),
        };
    }
}

// getCommand returns the sandbox command that matches the request.
function getCommand(req) {
    if (!(req.sandbox in commands)) {
        throw Error(`unknown sandbox: ${req.sandbox}`);
    }
    if (!(req.command in commands[req.sandbox])) {
        throw Error(`unknown command: ${req.sandbox}.${req.command}`);
    }
    return commands[req.sandbox][req.command];
}

// prepareRequest sets the main filename if necessary.
function prepareRequest(step, req) {
    if ("" in req.files) {
        req.files[step.entry] = req.files[""];
        delete req.files[""];
    }
    return req;
}

// execStep executes a specific command step.
async function execStep(step, req) {
    const box = boxes[step.box];
    const program = await init(step.box);
    const args = buildArgs(step, req);
    const fs = buildFileSystem(req);
    const output = await runProgram(box, program, args, fs);
    return output;
}

// buildArgs prepares arguments for running a WASI binary.
function buildArgs(step, req) {
    if (!step.stdin) {
        return step.args;
    }
    return step.args.map((arg) => (arg == step.entry ? req.files[step.entry] : arg));
}

// buildFileSystem prepares the file system for running a WASI binary.
function buildFileSystem(req) {
    const fs = {};
    const now = new Date();
    for (let name in req.files) {
        const path = `/src/${name}`;
        fs[path] = {
            path: path,
            timestamps: {
                access: now,
                change: now,
                modification: now,
            },
            mode: "string",
            content: req.files[name],
        };
    }
    return fs;
}

// runProgram executes a WASI binary.
async function runProgram(box, program, args, fs) {
    const stdout = [];
    const stderr = [];
    const start = new Date();
    const result = await WASI.start(program(), {
        args: [box.program, ...args],
        stdout: (out) => stdout.push(out),
        stderr: (err) => stderr.push(err),
        fs: fs,
    });
    const elapsed = new Date() - start;
    return {
        ok: result.exitCode == 0,
        elapsed: elapsed,
        stdout: stdout.join(""),
        stderr: stderr.join(""),
    };
}

// readFile fetches the file and returns its contents as an Uint8Array.
async function readFile(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${url}: http status ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
}

// getScriptUrl returns the full URL of the current script as a string.
function getScriptUrl() {
    if (typeof import.meta !== "undefined" && import.meta.url) {
        return import.meta.url;
    }
    return document.currentScript.src;
}

// add the engine to the registry
codobj.engines = {
    ...codobj.engines,
    ...{ wasi: { init, exec } },
};

export default { init, exec };
