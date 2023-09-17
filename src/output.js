// An output of an interactive code snippet.
import { sanitize } from "./text.js";

const template = document.createElement("template");
template.innerHTML = `
<a href="#close">✕</a>
<pre><code></code></pre>
`;

// CodapiOutput prints the output of an interactive code snippet.
class CodapiOutput extends HTMLElement {
    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
        this.close = this.querySelector("a");
        this.output = this.querySelector("pre > code");
    }

    connectedCallback() {
        if (this.ready) {
            return;
        }
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
        let html = [];
        if (result.stdout) {
            html.push(sanitize(result.stdout));
        }
        if (result.stderr) {
            html.push(sanitize(result.stderr));
        }
        this.output.innerHTML = html.join("\n");
        this.show();
    }

    // showMessage shows a message.
    showMessage(msg) {
        this.output.innerHTML = msg;
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
}

export { CodapiOutput };
