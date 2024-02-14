// Codapi global object tests.

import testing from "./testing.js";

const t = new testing.T("codapi");

async function runTests() {
    t.log("Running tests...");
    await testObject();
    await testEngines();
    t.summary();
    return t.errorCount;
}

async function testObject() {
    t.log("testObject...");
    t.assert("is not null", typeof window.codapi == "object");
}

async function testEngines() {
    t.log("testEngines...");
    t.assert("has engines", typeof window.codapi.engines == "object");
    t.assert("has codapi engine", typeof window.codapi.engines.codapi == "object");
    t.assert("has browser engine", typeof window.codapi.engines.browser == "object");
}

export default { runTests };
