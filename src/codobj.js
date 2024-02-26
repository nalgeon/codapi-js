// Global Codapi object.

const codobj = window.codapi ?? {};
codobj.version = typeof VERSION !== "undefined" ? VERSION : "main";
codobj.engines = codobj.engines ?? {};
codobj.settings = codobj.settings ?? {};
window.codapi = codobj;

// CodapiSettings manages the Codapi settings.
class CodapiSettings extends HTMLElement {
    connectedCallback() {
        if (this.ready) {
            return;
        }
        codobj.settings.url = this.getAttribute("url");
        this.ready = true;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        codobj.settings[name] = newValue;
    }
}

if (!window.customElements.get("codapi-settings")) {
    customElements.define("codapi-settings", CodapiSettings);
}

export { codobj, CodapiSettings };
