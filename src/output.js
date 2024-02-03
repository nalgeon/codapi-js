// An output of an interactive code snippet.

// Output modes.
const OutputMode = {
    text: "text",
    svg: "svg",
    html: "html",
    dom: "dom",
    hidden: "hidden",
};

const template = document.createElement("template");
template.innerHTML = `
<a href="#close">✕</a>
<pre><code></code></pre>
`;

// output builders.
const builders = {
    // returns the result as a text node.
    [OutputMode.text]: (result) => {
        let html = [];
        if (result.stdout) {
            html.push(result.stdout);
        }
        if (result.stderr) {
            html.push(result.stderr);
        }
        return document.createTextNode(html.join("\n"));
    },

    // returns the result as an SVG element.
    [OutputMode.svg]: (result) => {
        if (result.stderr) {
            return document.createTextNode(result.stderr);
        }
        const doc = new DOMParser().parseFromString(result.stdout, "image/svg+xml");
        if (doc.querySelector("parsererror")) {
            return document.createTextNode(result.stdout);
        }
        return doc.documentElement;
    },

    // returns the result as a document fragment.
    [OutputMode.html]: (result) => {
        if (result.stderr) {
            return document.createTextNode(result.stderr);
        }
        const doc = new DOMParser().parseFromString(result.stdout, "text/html");
        if (doc.querySelector("parsererror")) {
            return document.createTextNode(result.stdout);
        }
        const frag = document.createDocumentFragment();
        Array.from(doc.body.childNodes).forEach((child) => frag.appendChild(child));
        return frag;
    },

    // treats the result as a DOM node unless it's an error.
    [OutputMode.dom]: (result) => {
        if (result.stderr) {
            return document.createTextNode(result.stderr);
        }
        return result.stdout;
    },

    // hides the result unless it's an error.
    [OutputMode.hidden]: (result) => {
        if (result.stderr) {
            return document.createTextNode(result.stderr);
        }
        return null;
    },
};

// CodapiOutput prints the output of an interactive code snippet.
class CodapiOutput extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (this.ready) {
            return;
        }
        this.appendChild(template.content.cloneNode(true));
        this.close = this.querySelector("a");
        this.output = this.querySelector("pre > code");
        this.close.addEventListener("click", (e) => {
            e.preventDefault();
            this.hide();
        });
        this.ready = true;
    }

    // fadeOut slightly fades out the output.
    fadeOut() {
        this.style.opacity = 0.4;
    }

    // fadeIn fades the output back in.
    fadeIn() {
        setTimeout(() => {
            this.style.opacity = "";
        }, 100);
    }

    // showResult shows the results of the code execution.
    showResult(result) {
        const node = builders[this.mode](result);
        this.output.innerHTML = "";
        if (!node) {
            this.hide();
            return;
        }
        this.output.appendChild(node);
        this.show();
    }

    // showMessage shows a message.
    showMessage(msg) {
        this.output.innerText = msg;
        if (msg) {
            this.show();
        } else {
            this.hide();
        }
    }

    // showError shows an error.
    showError(exc) {
        const msg = exc.message + (exc.stack ? `\n${exc.stack}` : "");
        this.showMessage(msg);
    }

    show() {
        this.removeAttribute("hidden");
    }

    hide() {
        this.setAttribute("hidden", "");
    }

    // output mode.
    get mode() {
        return this.getAttribute("mode") || OutputMode.text;
    }
    set mode(value) {
        if (!(value in OutputMode)) {
            value = OutputMode.text;
        }
        this.setAttribute("mode", value);
    }
}

export { CodapiOutput };
