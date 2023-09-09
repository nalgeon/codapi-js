// Code actions toolbar web component.

const template = document.createElement("template");
template.innerHTML = `
<button>Run</button>
<a href="#edit" hidden>Edit</a>
<codapi-status></codapi-status>
`;

// CodapiToolbar defines a toolbar with action buttons.
class CodapiToolbar extends HTMLElement {
    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        if (this.ready) {
            return;
        }
        this.render();
        this.listen();
        this.ready = true;
    }

    render() {
        this.run = this.querySelector("button");
        this.edit = this.querySelector("a");
        this.status = this.querySelector("codapi-status");
    }

    listen() {
        this.run.addEventListener("click", (e) => {
            this.dispatchEvent(new Event("run"));
        });
        this.edit.addEventListener("click", (e) => {
            this.dispatchEvent(new Event("edit"));
        });
    }

    showRunning() {
        this.run.setAttribute("disabled", "");
        this.status.showRunning();
    }

    showFinished(result) {
        this.run.removeAttribute("disabled");
        this.status.showFinished(result);
    }

    get editable() {
        return !this.edit.hasAttribute("hidden");
    }

    set editable(value) {
        if (value) {
            this.edit.removeAttribute("hidden");
        } else {
            this.edit.setAttribute("hidden", "");
        }
    }
}

export { CodapiToolbar };
