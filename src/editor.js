// Code viewer/editor.

const TAB_WIDTH = 4;

// EditorMode mode.
const EditorMode = {
    off: "off",
    basic: "basic",
    external: "external",
};

// CodeElement is a wrapper for the code viewer/editor element.
class CodeElement extends EventTarget {
    constructor(el, mode, executeFunc) {
        super();
        this.el = el;
        this.mode = mode;
        this.executeFunc = executeFunc;
        this.fixFormatting();
        this.listen();
    }

    // listen handles editing-related events
    // if the editing is enabled.
    listen() {
        if (this.mode == EditorMode.off) {
            // all editing features are disabled
            return;
        }

        if (this.mode == EditorMode.external) {
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
        if (code.innerHTML.includes("</span>")) {
            code.textContent = code.textContent;
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
        if (event.key !== "Enter" && event.key !== "NumpadEnter") {
            return;
        }
        event.preventDefault();
        this.executeFunc();
    }

    // onPaste converts the pasted data to plain text
    onPaste(event) {
        event.preventDefault();
        // get text representation of clipboard
        const text = (event.originalEvent || event).clipboardData.getData("text/plain");
        // insert text manually
        document.execCommand("insertText", false, text);
    }

    // fixFormatting removes invalid formatting from the code,
    // while preserving the syntax highlighting.
    fixFormatting() {
        setTimeout(() => {
            this.el.innerHTML = this.el.innerHTML
                // Docusaurus uses <br> for new lines inside code blocks,
                // so we need to replace it with \n
                .replaceAll("<br>", "\n")
                // convert non-breaking spaces to normal ones
                .replace(/[\u00A0]/g, " ");
        }, 0);
    }

    // focusEnd sets the cursor to the end of the element's content.
    focusEnd() {
        this.el.focus();
        const selection = window.getSelection();
        selection.selectAllChildren(this.el);
        selection.collapseToEnd();
    }

    // isEmpty returns true if the snippet has no code.
    get isEmpty() {
        return this.el.textContent.trim() == "";
    }

    // value is the plain text code value.
    get value() {
        return this.el.textContent.trim();
    }
    set value(val) {
        this.el.textContent = val;
    }
}

export { EditorMode, CodeElement };
