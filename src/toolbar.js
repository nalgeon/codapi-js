// Code actions toolbar web component.

import { Action } from "./action.js";

const template = document.createElement("template");
template.innerHTML = `
<button hidden>Run</button>
<a href="#edit" hidden>Edit</a>
<codapi-status></codapi-status>
`;

// CodapiToolbar defines a toolbar with action buttons.
class CodapiToolbar extends HTMLElement {
    constructor() {
        super();
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
        this.appendChild(template.content.cloneNode(true));
        this.run = this.querySelector("button");
        this.edit = this.querySelector("a");
        this.status = this.querySelector("codapi-status");
        const actions = this.getAttribute("actions");
        this.addActions(actions ? actions.split(" ") : null);
    }

    listen() {
        this.run.addEventListener("click", (e) => {
            this.dispatchEvent(new Event("run"));
        });
        this.edit.addEventListener("click", (e) => {
            e.preventDefault();
            this.dispatchEvent(new Event("edit"));
        });
    }

    addActions(specs) {
        if (!specs) {
            return;
        }

        for (let spec of specs) {
            const action = Action.parse(spec);
            if (!action) {
                continue;
            }
            const btn = this.createButton(action);
            this.insertBefore(btn, this.status);
        }
    }

    createButton(action) {
        const btn = document.createElement("a");
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const event = new CustomEvent(action.type, {
                detail: action.value,
            });
            this.dispatchEvent(event);
        });
        btn.innerText = action.title;
        btn.href = "#" + action.value;
        return btn;
    }

    showRunning() {
        this.run.setAttribute("disabled", "");
        this.status.showRunning();
    }

    showFinished(result) {
        this.run.removeAttribute("disabled");
        this.status.showFinished(result);
    }

    showStatus(message) {
        this.run.removeAttribute("disabled");
        this.status.showMessage(message);
    }

    get runnable() {
        return !this.run.hasAttribute("hidden");
    }

    set runnable(value) {
        if (value) {
            this.run.removeAttribute("hidden");
        } else {
            this.run.setAttribute("hidden", "");
        }
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

if (!window.customElements.get("codapi-toolbar")) {
    customElements.define("codapi-toolbar", CodapiToolbar);
}

export { CodapiToolbar };
