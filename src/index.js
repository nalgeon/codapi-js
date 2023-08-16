// Interactive code example web components.

import { CodapiExample } from "./example.js";
import { CodapiOutput } from "./output.js";

if (!window.customElements.get("codapi-example")) {
    window.CodapiExample = CodapiExample;
    customElements.define("codapi-example", CodapiExample);
    customElements.define("codapi-output", CodapiOutput);
}
