// An output of an interactive code snippet.

// CodapiOutput prints the output of an interactive code snippet.
class CodapiOutput extends HTMLElement {
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
        this.style.display = "block";
        const mark = result.ok ? "✓" : "✗";
        this.innerHTML = `
            <p>${mark} Took ${result.duration} ms</p>
            <pre><code>${html.join("\n")}</code></pre>
        `;
    }

    // showMessage shows a message.
    showMessage(msg) {
        this.style.display = "block";
        this.innerHTML = `<pre><code>${msg}</code></pre>`;
    }

    // showError shows an error.
    showError(exc) {
        const msg = exc.message + (exc.stack ? `\n${exc.stack}` : "");
        this.style.display = "block";
        this.innerHTML = `<pre><code>${msg}</code></pre>`;
    }
}

// sanitize strips HTML from the text.
function sanitize(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

export { CodapiOutput };
