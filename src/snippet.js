// An interactive code snippet.

const TAB_WIDTH = 4;

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
            toolbar: null,
            run: null,
            edit: null,
            promo: null,
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
        this.executor = new Executor({
            sandbox: this.getAttribute("sandbox"),
            command: this.getAttribute("command"),
            template: this.getAttribute("template"),
            url: this.getAttribute("url"),
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
        if (this.selector) {
            this.ui.code = document.querySelector(this.selector);
        } else {
            this.ui.code = this.previousElementSibling;
        }

        this.ui.output = document.createElement("codapi-output");
        this.ui.output.style.display = "none";

        this.ui.run = document.createElement("button");
        this.ui.run.innerHTML = "Run";
        this.ui.run.addEventListener("click", (e) => {
            this.execute(this.ui.code.innerText);
        });

        this.ui.toolbar = document.createElement("div");
        this.ui.toolbar.appendChild(this.ui.run);

        this.appendChild(this.ui.toolbar);
        this.appendChild(this.ui.output);
    }

    // makeEditable allows editing
    // and executing the updated snippet.
    makeEditable() {
        if (this.editor == Editor.off) {
            // all features are disabled
            return;
        }

        if (this.editor == Editor.external) {
            // editing features are handled by an external editor,
            // so only enable the execute shortcut
            this.ui.code.addEventListener(
                "keydown",
                this.handleExecute.bind(this)
            );
            return;
        }

        // otherwise, enable basic editing features
        // make the element editable
        this.ui.code.contentEditable = "true";
        // indent on Tab
        this.ui.code.addEventListener("keydown", this.handleIndent.bind(this));
        // always paste as plain text
        this.ui.code.addEventListener("paste", this.onPaste.bind(this));
        // execute shortcut
        this.ui.code.addEventListener("keydown", this.handleExecute.bind(this));

        // add an 'edit' link
        this.ui.edit = document.createElement("a");
        this.ui.edit.innerHTML = "Edit";
        this.ui.edit.style.cursor = "pointer";
        this.ui.edit.style.display = "inline-block";
        this.ui.edit.style.marginLeft = "1em";
        this.ui.toolbar.appendChild(this.ui.edit);

        this.ui.edit.addEventListener("click", (e) => {
            this.ui.code.focus();
            return false;
        });
    }

    // showPromo shows a link to the codapi website.
    showPromo() {
        if (this.ui.promo) {
            return;
        }
        this.ui.promo = document.createElement("span");
        this.ui.promo.innerHTML = `powered by <a href="https://antonz.org/codapi">codapi</a>`;
        this.ui.promo.style.display = "inline-block";
        this.ui.promo.style.marginLeft = "1em";
        this.ui.toolbar.appendChild(this.ui.promo);
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
        code = code.trim();
        if (!code) {
            this.ui.output.showMessage("");
            return;
        }
        try {
            this.ui.run.setAttribute("disabled", "disabled");
            this.ui.output.fadeOut();
            this.setState(State.running);
            const result = await this.executor.execute(code);
            this.setState(result.ok ? State.succeded : State.failed);
            this.ui.output.showResult(result);
            // this.showPromo();
        } catch (exc) {
            this.setState(State.failed);
            this.ui.output.showError(exc);
        } finally {
            this.ui.run.removeAttribute("disabled");
            this.ui.output.fadeIn();
        }
    }
}

export { CodapiSnippet };
