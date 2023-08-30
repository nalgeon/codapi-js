// Interactive code snippet web component.

const TAB_WIDTH = 4;

import { CodapiStatus } from "./status.js";
import { CodapiOutput } from "./output.js";
import { Executor } from "./executor.js";

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
        this.buildUI();
        this.makeEditable();
    }

    // buildUI prepares the snippet UI.
    buildUI() {
        const code = this.selector
            ? document.querySelector(this.selector)
            : this.previousElementSibling;

        const output = document.createElement("codapi-output");
        output.style.display = "none";

        const run = document.createElement("button");
        run.innerHTML = "Run";
        run.addEventListener("click", (e) => {
            this.execute(code.innerText);
        });

        const status = document.createElement("codapi-status");
        status.style.display = "inline-block";
        status.style.marginLeft = "1em";

        const toolbar = document.createElement("div");
        toolbar.appendChild(run);
        toolbar.appendChild(status);

        this.appendChild(toolbar);
        this.appendChild(output);

        this.ui = { ...this.ui, ...{ code, run, status, output } };
    }

    // makeEditable allows editing
    // and executing the updated snippet.
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

        // add an 'edit' link
        const edit = document.createElement("a");
        edit.innerHTML = "Edit";
        edit.style.cursor = "pointer";
        edit.style.display = "inline-block";
        edit.style.marginLeft = "1em";
        edit.addEventListener("click", (e) => {
            code.focus();
            return false;
        });

        this.ui.run.insertAdjacentElement("afterend", edit);
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
        this.execute(this.ui.code.innerText);
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
    async execute(code) {
        const { run, status, output } = this.ui;
        code = code.trim();
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
            const result = await this.executor.execute(code);

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
}

if (!window.customElements.get("codapi-snippet")) {
    window.CodapiSnippet = CodapiSnippet;
    customElements.define("codapi-snippet", CodapiSnippet);
    customElements.define("codapi-status", CodapiStatus);
    customElements.define("codapi-output", CodapiOutput);
}

export { CodapiSnippet };
