// Interactive code snippet web component.

import "./toolbar.js";
import "./status.js";
import "./output.js";
import { EditorMode, CodeElement } from "./editor.js";
import { Executor } from "./executor.js";
import text from "./text.js";
import codegen from "./codegen.js";

// UI messages.
const messages = {
    fallback: "✘ Failed, using fallback",
};

// Snippet state.
const State = {
    unknown: "unknown",
    running: "running",
    failed: "failed",
    succeded: "succeded",
};

const template = document.createElement("template");
template.innerHTML = `
<codapi-toolbar></codapi-toolbar>
<codapi-output hidden></codapi-output>
`;

// CodapiSnippet is an interactive code snippet with associated commands.
class CodapiSnippet extends HTMLElement {
    static observedAttributes = ["sandbox", "engine", "command", "template", "files"];

    constructor() {
        super();

        // state
        this.ready = false;
        this.executor = null;

        // ui
        this._snippet = null;
        this._toolbar = null;
        this._output = null;
        this._fallback = null;
    }

    connectedCallback() {
        if (this.ready) {
            return;
        }
        // the initialization can be delayed,
        // e.g. if we have to wait for syntax highlighting
        const timeout = parseInt(this.getAttribute("init-delay"), 10) || 0;
        delay(() => {
            this.init();
            this.render();
            this.listen();
            this.ready = true;
            this.dispatchEvent(new Event("load"));
        }, timeout);
    }

    // init initializes the component state.
    init() {
        const filesStr = this.getAttribute("files");
        this.executor = this.hasAttribute("sandbox")
            ? new Executor({
                  engine: this.getAttribute("engine"),
                  sandbox: this.getAttribute("sandbox"),
                  command: this.getAttribute("command"),
                  template: this.getAttribute("template"),
                  files: filesStr ? filesStr.split(" ") : null,
              })
            : null;
        this.dependsOn = this.getAttribute("depends-on");
        this.state = State.unknown;
    }

    // render prepares an interactive snippet.
    render() {
        this.appendChild(template.content.cloneNode(true));
        const codeEl = this.findCodeElement();
        this.snippet = new CodeElement(codeEl, this.editor, this.execute.bind(this));

        this._toolbar = this.querySelector("codapi-toolbar");
        const actions = this.getAttribute("actions");
        this._toolbar.runnable = this.executor != null;
        this._toolbar.addActions(actions ? actions.split(" ") : null);

        const status = this._toolbar.querySelector("codapi-status");
        if (this.hasAttribute("status-running")) {
            status.setAttribute("running", this.getAttribute("status-running"));
        }
        if (this.hasAttribute("status-failed")) {
            status.setAttribute("failed", this.getAttribute("status-failed"));
        }
        if (this.hasAttribute("status-done")) {
            status.setAttribute("done", this.getAttribute("status-done"));
        }

        this._output = this.querySelector("codapi-output");
        this._output.mode = this.getAttribute("output-mode");
        this._output.tail = this.hasAttribute("output-tail");
        if (this.hasAttribute("output")) {
            this._fallback = this.extractFallback(this.getAttribute("output"));
        }
    }

    // listen allows running and editing the code.
    listen() {
        // run button
        this._toolbar.addEventListener("run", (e) => {
            this.execute();
        });

        // custom toolbar buttons
        this._toolbar.addEventListener("command", (e) => {
            this.execute(e.detail);
        });
        this._toolbar.addEventListener("event", (e) => {
            this.dispatchEvent(new Event(e.detail));
        });

        // editing
        if (this.editor == EditorMode.basic) {
            // show the 'edit' link
            this._toolbar.editable = true;
            this._toolbar.addEventListener("edit", (e) => {
                this.snippet.focusEnd();
            });
        }

        // hide output
        this.snippet.addEventListener("hide", (e) => {
            this._output.hide();
        });
    }

    // findCodeElement returns the element containing the code snippet.
    findCodeElement() {
        if (!this.selector) {
            // search for `code` in the previous sibling
            // if snippet is the only child, use parent's previous sibling
            const prev = this.previousElementSibling || this.parentElement.previousElementSibling;
            return prev.querySelector("code") || prev;
        }

        let el;
        if (this.selector.startsWith("@prev")) {
            // search for selector in the previous sibling
            const prev = this.previousElementSibling;
            const [_, selector] = text.cut(this.selector, " ");
            el = prev.querySelector(selector);
        } else {
            // search for selector globally
            el = document.querySelector(this.selector);
        }

        if (!el) {
            throw Error(`element not found: ${this.selector}`);
        }
        return el;
    }

    // extractFallback extracts the predefined result for the snippet.
    extractFallback(selector) {
        const el = this.findOutputElement(selector);
        const stdoutEl = el.querySelector("code") || el;
        const stdout = stdoutEl.textContent.trim();
        el.parentElement.removeChild(el);
        return {
            ok: false,
            duration: 0,
            stdout: stdout,
            stderr: "",
        };
    }

    // findOutputElement returns the element containing the default code output.
    findOutputElement(selector) {
        if (!selector || selector == "@next") {
            // return the next sibling
            // if snippet is the only child, return parent's next sibling
            return this.nextElementSibling || this.parentElement.nextElementSibling;
        }

        let el;
        if (selector.startsWith("@next")) {
            // search for selector in the next sibling
            const next = this.nextElementSibling;
            const [_, elSelector] = text.cut(selector, " ");
            el = next.querySelector(elSelector);
        } else {
            // search for selector globally
            el = document.querySelector(selector);
        }

        if (!el) {
            throw Error(`element not found: ${selector}`);
        }
        return el;
    }

    // execute runs the code.
    async execute(command = undefined) {
        if (!this.executor) {
            return;
        }
        if (this.snippet.isEmpty) {
            this._output.showMessage("(empty)");
            return;
        }

        try {
            // prepare to execute
            const code = gatherCode(this);
            this.dispatchEvent(new CustomEvent("execute", { detail: code }));
            this.state = State.running;
            this._toolbar.showRunning();
            this._output.fadeOut();

            // execute code
            const result = await this.executor.execute(command, code);

            // show results
            this.state = result.ok ? State.succeded : State.failed;
            this._toolbar.showFinished(result);
            this._output.showResult(result);
            this.dispatchEvent(new CustomEvent("result", { detail: result }));
        } catch (exc) {
            if (this._fallback) {
                // show fallback results
                this._toolbar.showStatus(messages.fallback);
                this._output.showResult(this._fallback);
            } else {
                // show error
                this._toolbar.showFinished({});
                this._output.showMessage(exc.message);
            }
            console.error(exc);
            this.state = State.failed;
            this.dispatchEvent(new CustomEvent("error", { detail: exc }));
        } finally {
            this._output.fadeIn();
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "engine":
            case "sandbox":
            case "command":
            case "template":
            case "files":
                const filesStr = this.getAttribute("files");
                this.executor = new Executor({
                    engine: this.getAttribute("engine"),
                    sandbox: this.getAttribute("sandbox"),
                    command: this.getAttribute("command"),
                    template: this.getAttribute("template"),
                    files: filesStr ? filesStr.split(" ") : null,
                });
                break;
        }
    }

    // showStatus shows a custom message in the status bar.
    showStatus(message) {
        this._toolbar.showStatus(message);
    }

    // what syntax is used.
    get syntax() {
        return this.getAttribute("syntax") || this.getAttribute("sandbox");
    }
    set syntax(value) {
        this.setAttribute("syntax", value);
    }

    // selector is the code element css selector.
    get selector() {
        return this.getAttribute("selector");
    }
    set selector(value) {
        this.setAttribute("selector", value);
    }

    // editor is the editor mode.
    get editor() {
        return this.getAttribute("editor") || EditorMode.off;
    }
    set editor(value) {
        this.setAttribute("editor", value);
    }

    // code is the plain text code value.
    get code() {
        return this.snippet.value;
    }
    set code(value) {
        this.snippet.value = value;
    }

    // state is the current snippet state.
    get state() {
        return this.getAttribute("state");
    }
    set state(value) {
        this.setAttribute("state", value);
    }
}

// gatherCode walks snippet dependencies backwards
// and builds the complete code from the first snippet
// to the last (which is the current one).
function gatherCode(curSnip) {
    let code = curSnip.code;
    let ids = curSnip.dependsOn ? curSnip.dependsOn.split(" ") : [];
    // print separators between snippets to tail output later
    const sep = curSnip.hasAttribute("output-tail") ? codegen.hr(curSnip.syntax) : "";
    // first dependency should be the last one to be prepended
    for (const id of ids.reverse()) {
        const snip = document.getElementById(id);
        if (!snip) {
            throw new Error(`#${id} dependency not found`);
        }
        code = snip.code + `\n${sep}\n` + code;
        if (snip.dependsOn) {
            const moreIDs = snip.dependsOn.split(" ").filter((i) => !ids.includes(i));
            // first dependency should be the last one to be prepended
            ids.push(...moreIDs.reverse());
        }
    }
    return code;
}

// delay executes a function after a timeout,
// or immediately if the timeout is zero.
function delay(func, timeout) {
    if (timeout <= 0) {
        func();
        return;
    }
    setTimeout(func, timeout);
}

if (!window.customElements.get("codapi-snippet")) {
    customElements.define("codapi-snippet", CodapiSnippet);
}

export { CodapiSnippet };
