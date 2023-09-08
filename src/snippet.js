// Interactive code snippet web component.

const TAB_WIDTH = 4;

import { CodapiStatus } from "./status.js";
import { CodapiOutput } from "./output.js";
import { Executor } from "./executor.js";
import { sanitize } from "./text.js";

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

// CodapiSnippet initializes an interactive code snippet.
class CodapiSnippet extends HTMLElement {
    constructor() {
        super();

        this.selector = "";
        this.editor = Editor.off;
        this.ready = false;
        this.executor = null;

        this.ui = {
            code: null,
            toolbar: null,
            run: null,
            status: null,
            output: null,
        };
    }

    connectedCallback() {
        if (this.ready) {
            return;
        }
        this.init();
        this.render();
        this.ready = true;
    }

    // init initializes the component state.
    init() {
        this.selector = this.getAttribute("selector");
        this.editor = this.getAttribute("editor") || Editor.off;
        const filesStr = this.getAttribute("files");
        this.executor = new Executor({
            sandbox: this.getAttribute("sandbox"),
            command: this.getAttribute("command"),
            url: this.getAttribute("url"),
            template: this.getAttribute("template"),
            files: filesStr ? filesStr.split(" ") : null,
        });
        this.setState(State.unknown);
    }

    // render prepares an interactive snippet.
    render() {
        this.attachToCode();
        this.addToolbar();
        this.addStatus();
        this.addOutput();
        this.makeEditable();
    }

    // attachToCode finds the element with code and attaches to it.
    attachToCode() {
        const code = this.findCodeElement();
        this.ui.code = code;
    }

    // addToolbar creates the toolbar element with the Run button.
    addToolbar() {
        const run = document.createElement("button");
        run.innerHTML = "Run";
        run.addEventListener("click", (e) => {
            this.execute();
        });

        const toolbar = document.createElement("div");
        toolbar.appendChild(run);
        this.appendChild(toolbar);
        this.ui.run = run;
        this.ui.toolbar = toolbar;
    }

    // addStatus creates the status message element.
    addStatus() {
        const status = document.createElement("codapi-status");
        this.ui.toolbar.appendChild(status);
        this.ui.status = status;
    }

    // addOutput creates the code output element.
    addOutput() {
        const output = document.createElement("codapi-output");
        output.style.display = "none";
        this.appendChild(output);
        this.ui.output = output;
    }

    // makeEditable allows editing and executing the updated code.
    makeEditable() {
        if (this.editor == Editor.off) {
            // all features are disabled
            return;
        }

        const code = this.ui.code;

        if (this.editor == Editor.external) {
            // editing features are handled by an external editor,
            // so only enable the execute shortcut
            code.addEventListener("keydown", this.handleExecute.bind(this));
            return;
        }

        // otherwise, enable basic editing features
        // make the element editable
        code.contentEditable = "true";
        // indent on Tab
        code.addEventListener("keydown", this.handleIndent.bind(this));
        // always paste as plain text
        code.addEventListener("paste", this.onPaste.bind(this));
        // execute shortcut
        code.addEventListener("keydown", this.handleExecute.bind(this));
        // init editor on first focus
        this.onFocus = this.initEditor.bind(this);
        code.addEventListener("focus", this.onFocus);

        // add an 'edit' link
        const edit = document.createElement("a");
        edit.href = "#edit";
        edit.innerHTML = "Edit";
        edit.addEventListener("click", (e) => {
            focusEnd(code);
        });

        this.ui.run.insertAdjacentElement("afterend", edit);
    }

    // findCodeElement returns the element containing the code snippet.
    findCodeElement() {
        if (this.selector) {
            return document.querySelector(this.selector);
        }
        const prev = this.previousElementSibling;
        return prev.querySelector("code") || prev;
    }

    // initEditor removes prepares the code snippet
    // for editing for the first time.
    initEditor(event) {
        const code = event.target;
        if (code.innerHTML.includes("</span>")) {
            // remove syntax highlighting
            code.innerHTML = code.innerText.replace(/\n\n/g, "\n");
        }
        code.removeEventListener("focus", this.onFocus);
        delete this.onFocus;
    }

    // setState sets the state attribute.
    setState(value) {
        this.setAttribute("state", value);
    }

    // handleIndent indents text with Tab
    handleIndent(event) {
        if (event.key != "Tab") {
            return false;
        }
        event.preventDefault();
        document.execCommand("insertHTML", false, " ".repeat(TAB_WIDTH));
        return true;
    }

    // handleExecute truggers 'execute' event by Ctrl/Cmd+Enter
    handleExecute(event) {
        // Ctrl+Enter or Cmd+Enter
        if (!event.ctrlKey && !event.metaKey) {
            return false;
        }
        // 10 and 13 are Enter codes
        if (event.keyCode != 10 && event.keyCode != 13) {
            return false;
        }
        this.execute();
        return true;
    }

    // onPaste converts the pasted data to plain text
    onPaste(event) {
        if (this.editor != Editor.basic) {
            return false;
        }
        event.preventDefault();
        // get text representation of clipboard
        const text = (event.originalEvent || event).clipboardData.getData(
            "text/plain"
        );
        // insert text manually
        document.execCommand("insertHTML", false, text);
    }

    // execute runs the code.
    async execute(command = undefined) {
        const { run, status, output } = this.ui;
        const code = this.code;
        if (!code) {
            output.showMessage("(empty)");
            return;
        }
        try {
            // prepare to execute
            this.dispatchEvent(new CustomEvent("execute", { detail: code }));
            run.setAttribute("disabled", "disabled");
            output.fadeOut();
            this.setState(State.running);
            status.showRunning();

            // execute code
            const result = await this.executor.execute(command, code);

            // show results
            this.setState(result.ok ? State.succeded : State.failed);
            status.showFinished(result);
            output.showResult(result);
            this.dispatchEvent(new CustomEvent("result", { detail: result }));
        } catch (exc) {
            // show error
            this.setState(State.failed);
            status.showFinished(null);
            output.showError(exc);
            this.dispatchEvent(new CustomEvent("error", { detail: exc }));
        } finally {
            // clean up ui
            run.removeAttribute("disabled");
            output.fadeIn();
        }
    }

    get code() {
        return this.ui.code.innerText.trim();
    }

    set code(value) {
        this.ui.code.innerHTML = sanitize(value);
    }
}

// focusEnd sets the cursor to the end of the element's content.
function focusEnd(el) {
    el.focus();
    const selection = window.getSelection();
    selection.selectAllChildren(el);
    selection.collapseToEnd();
}

if (!window.customElements.get("codapi-snippet")) {
    window.CodapiSnippet = CodapiSnippet;
    customElements.define("codapi-snippet", CodapiSnippet);
    customElements.define("codapi-status", CodapiStatus);
    customElements.define("codapi-output", CodapiOutput);
}

export { CodapiSnippet };
