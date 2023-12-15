// Interactive code snippet web component.

const TAB_WIDTH = 4;

import { CodapiToolbar } from "./toolbar.js";
import { CodapiStatus } from "./status.js";
import { CodapiOutput } from "./output.js";
import { Executor } from "./executor.js";
import { sanitize } from "./text.js";

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

// Editor features.
const Editor = {
    off: "off",
    basic: "basic",
    external: "external",
};

const template = document.createElement("template");
template.innerHTML = `
<codapi-toolbar></codapi-toolbar>
<codapi-output hidden></codapi-output>
`;

// CodapiSnippet is an interactive code snippet with associated commands.
class CodapiSnippet extends HTMLElement {
    constructor() {
        super();

        // state
        this.ready = false;
        this.executor = null;

        // ui
        this.snippet = null;
        this.toolbar = null;
        this.output = null;
        this.fallback = null;
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
        this.executor = new Executor({
            sandbox: this.getAttribute("sandbox"),
            command: this.getAttribute("command"),
            url: this.getAttribute("url"),
            template: this.getAttribute("template"),
            files: filesStr ? filesStr.split(" ") : null,
        });
        this.state = State.unknown;
    }

    // render prepares an interactive snippet.
    render() {
        this.appendChild(template.content.cloneNode(true));
        const codeEl = this.findCodeElement();
        this.snippet = new CodeElement(
            codeEl,
            this.editor,
            this.execute.bind(this)
        );

        this.toolbar = this.querySelector("codapi-toolbar");
        const actions = this.getAttribute("actions");
        this.toolbar.addActions(actions ? actions.split(" ") : null);

        const status = this.toolbar.querySelector("codapi-status");
        if (this.hasAttribute("status-running")) {
            status.setAttribute("running", this.getAttribute("status-running"));
        }
        if (this.hasAttribute("status-failed")) {
            status.setAttribute("failed", this.getAttribute("status-failed"));
        }
        if (this.hasAttribute("status-done")) {
            status.setAttribute("done", this.getAttribute("status-done"));
        }

        this.output = this.querySelector("codapi-output");
        if (this.hasAttribute("output")) {
            this.fallback = this.extractFallback(this.getAttribute("output"));
        }
    }

    // listen allows running and editing the code.
    listen() {
        // run button
        this.toolbar.addEventListener("run", (e) => {
            this.execute();
        });

        // custom toolbar buttons
        this.toolbar.addEventListener("command", (e) => {
            this.execute(e.detail);
        });
        this.toolbar.addEventListener("event", (e) => {
            this.dispatchEvent(new Event(e.detail));
        });

        // editing
        if (this.editor == Editor.basic) {
            // show the 'edit' link
            this.toolbar.editable = true;
            this.toolbar.addEventListener("edit", (e) => {
                this.snippet.focusEnd();
            });
        }

        // hide output
        this.snippet.addEventListener("hide", (e) => {
            this.output.hide();
        });
    }

    // findCodeElement returns the element containing the code snippet.
    findCodeElement() {
        if (!this.selector) {
            // search for `code` in the previous sibling
            const prev = this.previousElementSibling;
            return prev.querySelector("code") || prev;
        }

        let el;
        if (this.selector.startsWith("@prev")) {
            // search for selector in the previous sibling
            const prev = this.previousElementSibling;
            const selector = this.selector.split(" ").slice(1).join(" ");
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
        const stdout = stdoutEl.innerText.trim();
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
        if (!selector) {
            return this.nextElementSibling;
        }

        let el;
        if (selector.startsWith("@next")) {
            // search for selector in the next sibling
            const next = this.nextElementSibling;
            const selector = selector.split(" ").slice(1).join(" ");
            el = next.querySelector(selector);
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
        if (!this.code) {
            this.output.showMessage("(empty)");
            return;
        }

        try {
            // prepare to execute
            this.dispatchEvent(
                new CustomEvent("execute", { detail: this.code })
            );
            this.state = State.running;
            this.toolbar.showRunning();
            this.output.fadeOut();

            // execute code
            const result = await this.executor.execute(command, this.code);

            // show results
            this.state = result.ok ? State.succeded : State.failed;
            this.toolbar.showFinished(result);
            this.output.showResult(result);
            this.dispatchEvent(new CustomEvent("result", { detail: result }));
        } catch (exc) {
            if (this.fallback) {
                // show fallback results
                this.toolbar.showStatus(messages.fallback);
                this.output.showResult(this.fallback);
            } else {
                // show error
                this.toolbar.showFinished({});
                this.output.showMessage(exc.message);
            }
            console.error(exc);
            this.state = State.failed;
            this.dispatchEvent(new CustomEvent("error", { detail: exc }));
        } finally {
            this.output.fadeIn();
        }
    }

    // showStatus shows a custom message in the status bar.
    showStatus(message) {
        this.toolbar.showStatus(message);
    }

    // selector is the code element css selector.
    get selector() {
        return this.getAttribute("selector");
    }

    // editor is the editor mode.
    get editor() {
        return this.getAttribute("editor") || Editor.off;
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

// CodeElement is a wrapper for the code viewer/editor element.
class CodeElement extends EventTarget {
    constructor(el, mode, executeFunc) {
        super();
        this.el = el;
        this.mode = mode;
        this.executeFunc = executeFunc;
        this.listen();
    }

    // listen handles editing-related events
    // if the editing is enabled.
    listen() {
        if (this.mode == Editor.off) {
            // all editing features are disabled
            return;
        }

        if (this.mode == Editor.external) {
            // editing features are handled by an external editor,
            // so only enable the execute shortcut
            this.el.addEventListener("keydown", this.handleExecute.bind(this));
            return;
        }

        // otherwise, enable basic editing features
        // make the element editable
        this.el.contentEditable = "true";
        // indent on Tab
        this.el.addEventListener("keydown", this.handleIndent.bind(this));
        // hide output on Esc
        this.el.addEventListener("keydown", this.handleHide.bind(this));
        // execute on Ctrl+Enter
        this.el.addEventListener("keydown", this.handleExecute.bind(this));
        // always paste as plain text
        this.el.addEventListener("paste", this.onPaste.bind(this));
        // init editor on first focus
        this.onFocus = this.initEditor.bind(this);
        this.el.addEventListener("focus", this.onFocus);
    }

    // initEditor removes prepares the code snippet
    // for editing for the first time.
    initEditor(event) {
        const code = event.target;
        if (
            code.innerHTML.startsWith('<span class="line">') ||
            code.innerHTML.startsWith('<span style="display:flex;">')
        ) {
            // remove syntax highlighting
            // remove double line feed
            code.innerText = code.innerText.replace(/\n\n/g, "\n");
        } else if (code.innerHTML.includes("</span>")) {
            // remove syntax highlighting
            code.innerText = code.innerText;
        }
        code.removeEventListener("focus", this.onFocus);
        delete this.onFocus;
    }

    // handleIndent indents text with Tab
    handleIndent(event) {
        if (event.key != "Tab") {
            return;
        }
        event.preventDefault();
        document.execCommand("insertHTML", false, " ".repeat(TAB_WIDTH));
    }

    // handleHide hides the output on Esc
    handleHide(event) {
        if (event.key != "Escape") {
            return;
        }
        event.preventDefault();
        this.dispatchEvent(new Event("hide"));
    }

    // handleExecute truggers 'execute' event by Ctrl/Cmd+Enter
    handleExecute(event) {
        // Ctrl+Enter or Cmd+Enter
        if (!event.ctrlKey && !event.metaKey) {
            return;
        }
        // 10 and 13 are Enter codes
        if (event.keyCode != 10 && event.keyCode != 13) {
            return;
        }
        event.preventDefault();
        this.executeFunc();
    }

    // onPaste converts the pasted data to plain text
    onPaste(event) {
        event.preventDefault();
        // get text representation of clipboard
        const text = (event.originalEvent || event).clipboardData.getData(
            "text/plain"
        );
        // insert text manually
        document.execCommand("insertText", false, text);
    }

    // focusEnd sets the cursor to the end of the element's content.
    focusEnd() {
        this.el.focus();
        const selection = window.getSelection();
        selection.selectAllChildren(this.el);
        selection.collapseToEnd();
    }

    // value is the plain text code value.
    get value() {
        // trim and convert non-breaking spaces to normal ones
        return this.el.innerText.trim().replace(/[\u00A0]/g, " ");
    }
    set value(val) {
        this.el.innerHTML = sanitize(val);
    }
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
    window.CodapiSnippet = CodapiSnippet;
    customElements.define("codapi-toolbar", CodapiToolbar);
    customElements.define("codapi-status", CodapiStatus);
    customElements.define("codapi-output", CodapiOutput);
    customElements.define("codapi-snippet", CodapiSnippet);
}

export { CodapiSnippet };
