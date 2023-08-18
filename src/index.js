// Interactive code snippet web components.

import { CodapiSnippet } from "./snippet.js";
import { CodapiStatus } from "./status.js";
import { CodapiOutput } from "./output.js";

if (!window.customElements.get("codapi-snippet")) {
    window.CodapiSnippet = CodapiSnippet;
    customElements.define("codapi-snippet", CodapiSnippet);
    customElements.define("codapi-status", CodapiStatus);
    customElements.define("codapi-output", CodapiOutput);
}
