// Interactive code snippet web component.

const TAB_WIDTH = 4;

import { CodapiToolbar } from "./toolbar.js";
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

        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        if (this.ready) {
            return;
        }
        this.init();
        this.render();
        this.listen();
        this.ready = true;
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
        const codeEl = this.findCodeElement();
        this.snippet = new CodeSnippet(
            codeEl,
            this.editor,
            this.execute.bind(this)
        );
        this.toolbar = this.querySelector("codapi-toolbar");
        this.output = this.querySelector("codapi-output");
    }

    // listen allows running and editing the code.
    listen() {
        this.toolbar.addEventListener("run", (e) => {
            this.execute();
        });

        if (this.editor == Editor.basic) {
            // show the 'edit' link
            this.toolbar.editable = true;
            this.toolbar.addEventListener("edit", (e) => {
                this.snippet.focusEnd();
            });
        }
    }

    // findCodeElement returns the element containing the code snippet.
    findCodeElement() {
        if (this.selector) {
            return document.querySelector(this.selector);
        }
        const prev = this.previousElementSibling;
        return prev.querySelector("code") || prev;
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
            // show error
            this.state = State.failed;
            this.toolbar.showFinished(null);
            this.output.showError(exc);
            this.dispatchEvent(new CustomEvent("error", { detail: exc }));
        } finally {
            this.output.fadeIn();
        }
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

// CodeSnippet is a wrapper for the code viewer/editor element.
class CodeSnippet {
    constructor(el, mode, executeFunc) {
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
        // always paste as plain text
        this.el.addEventListener("paste", this.onPaste.bind(this));
        // execute shortcut
        this.el.addEventListener("keydown", this.handleExecute.bind(this));
        // init editor on first focus
        this.onFocus = this.initEditor.bind(this);
        this.el.addEventListener("focus", this.onFocus);
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
        this.executeFunc();
        return true;
    }

    // onPaste converts the pasted data to plain text
    onPaste(event) {
        event.preventDefault();
        // get text representation of clipboard
        const text = (event.originalEvent || event).clipboardData.getData(
            "text/plain"
        );
        // insert text manually
        document.execCommand("insertHTML", false, text);
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
        return this.el.innerText.trim();
    }
    set value(val) {
        this.el.innerHTML = sanitize(val);
    }
}

if (!window.customElements.get("codapi-snippet")) {
    window.CodapiSnippet = CodapiSnippet;
    customElements.define("codapi-toolbar", CodapiToolbar);
    customElements.define("codapi-status", CodapiStatus);
    customElements.define("codapi-output", CodapiOutput);
    customElements.define("codapi-snippet", CodapiSnippet);
}

export { CodapiSnippet };
