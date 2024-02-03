// Execute JavaScript code.

const AsyncFunction = async function () {}.constructor;

// execJs executes JavaScript code using the browser engine.
async function exec(_, data) {
    try {
        const messages = [];
        patchConsole(messages);
        const [out, elapsed] = await execCode(data.files[""]);
        // return either the function result or the console log
        // if the function returned nothing
        return {
            ok: true,
            duration: elapsed,
            stdout: out ?? messages.join("\n"),
            stderr: "",
        };
    } catch (exc) {
        return {
            ok: false,
            duration: 0,
            stdout: "",
            stderr: exc.toString(),
        };
    } finally {
        unpatchConsole();
    }
}

// execCode executes code using an async funtion.
async function execCode(code) {
    const func = new AsyncFunction(code);
    const start = new Date();
    const out = await func();
    const elapsed = new Date() - start;
    return [out, elapsed];
}

// patchConsole redirects console logging to an array of messages
// (while preserving the original console logging).
function patchConsole(messages) {
    const consoleProxy = new Proxy(console, {
        get(target, prop) {
            if (prop === "log" || prop === "error" || prop === "warn") {
                return (...args) => {
                    const message = args.map((obj) => stringify(obj)).join(" ");
                    messages.push(message);
                    target[prop](...args);
                };
            }
            return target[prop];
        },
    });

    window._console = window.console;
    window.console = consoleProxy;
    window.addEventListener("error", (e) => console.log(e.error));
}

// unpatchConsole restores the original console logging.
function unpatchConsole() {
    window.console = window._console;
    delete window._console;
}

// stringify converts a value into a (hopefully) human-readable string.
function stringify(obj) {
    switch (typeof obj) {
        case "undefined":
            return "undefined";
        case "object":
            return JSON.stringify(obj);
        default:
            return obj.toString();
    }
}

export default { exec };
