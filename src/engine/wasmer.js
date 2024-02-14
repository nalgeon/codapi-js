// Execute code using the Wasmer WASI runtime.

import boxes from "./wasi/boxes.js";
import commands from "./wasi/commands.js";

const { runWasix, Directory, Wasmer } = WasmerSDK;
const initWasmer = WasmerSDK.init;
const programs = {};

// init downloads (if necessary) and returns a WASI binary by name.
async function init(name) {
    if (!(name in boxes)) {
        throw Error(`unknown box: ${name}`);
    }
    if (programs[name]) {
        return programs[name];
    }
    const box = boxes[name];
    const bytes = await readFile(box.url);
    programs[name] =
        box.type == "webc" ? await Wasmer.fromFile(bytes) : await WebAssembly.compile(bytes);
    return programs[name];
}

// exec executes a specific command using a WASI binary.
async function exec(_, req) {
    try {
        let output, elapsed;
        const cmd = getCommand(req);
        for (const step of cmd.steps) {
            prepareRequest(step, req);
            [output, elapsed] = await execStep(step, req);
            if (!output.ok) {
                break;
            }
        }
        return {
            ok: output.ok,
            duration: elapsed,
            stdout: output.stdout,
            stderr: output.stderr,
        };
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
    const start = new Date();
    const program = await init(step.box);
    const args = buildArgs(step, req);
    const output = await runProgram(box, program, args, req);
    const elapsed = new Date() - start;
    return [output, elapsed];
}

// buildArgs prepares arguments for running a WASI binary.
function buildArgs(step, req) {
    if (!step.stdin) {
        return step.args;
    }
    return step.args.map((arg) => (arg == step.entry ? req.files[step.entry] : arg));
}

// runProgram executes a WASI binary.
async function runProgram(box, program, args, req) {
    const instance =
        box.type == "webc"
            ? await program.commands[box.program].run({
                  args: args,
                  mount: {
                      "/out": new Directory(),
                      "/src": req.files,
                  },
              })
            : await runWasix(program, {
                  program: box.program,
                  args: args,
                  mount: {
                      "/out": new Directory(),
                      "/src": req.files,
                  },
              });
    const output = await instance.wait();
    return output;
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

// add the engine to the registry
window.codapi = window.codapi || {};
window.codapi.engines = {
    ...window.codapi.engines,
    ...{ wasi: { init, exec } },
};

// download the Wasmer runtime
await initWasmer();

export default { init, exec };
