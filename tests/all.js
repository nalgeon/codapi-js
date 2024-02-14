// Codapi automated tests.

import codapi from "./codapi.js";
import snippet from "./snippet.js";
import testing from "./testing.js";

const t = new testing.T("all");

async function runTests() {
    t.log("Running tests...");
    t.errorCount += await codapi.runTests();
    t.errorCount += await snippet.runTests();
    t.summary();
}

runTests();
