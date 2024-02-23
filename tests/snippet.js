// Codapi snippet tests.

import testing from "./testing.js";

const t = new testing.T("snippet");

async function runTests() {
    t.log("Running tests...");

    await testInit();
    await testInitDelay();

    await testAttachPrev();
    await testAttachParentPrev();
    await testAttachSelector();
    await testAttachSelectorPrev();

    await testEditorOff();
    await testEditorBasic();
    await testEditorExternal();

    await testEdit();
    await testRun();
    await testRunFailed();
    await testRunError();
    await testEditAndRun();

    await testEngineBrowser();
    await testEngineWasi();

    await testCustomStatus();
    await testCustomSandbox();
    await testCustomCommand();
    await testCustomEvent();

    await testFallbackOutput();
    await testHideOutput();

    await testOutputLog();
    await testOutputReturn();
    await testOutputLogAndReturn();

    await testOutputModeDefault();
    await testOutputModeText();
    await testOutputModeTable();
    await testOutputModeSVG();
    await testOutputModeHTML();
    await testOutputModeDOM();
    await testOutputModeHidden();

    await testTemplate();
    await testFiles();
    await testDependsOn();

    t.summary();
    return t.errorCount;
}

async function testInit() {
    t.log("testInit...");
    const ui = createSnippet(`
        <pre><code>print("hello")</code></pre>
        <codapi-snippet sandbox="python" editor="basic"></codapi-snippet>
    `);
    t.assert("run button", ui.toolbar.innerHTML.includes("Run"));
    t.assert("edit button", ui.toolbar.innerHTML.includes("Edit"));
    t.assert("status", ui.status.innerHTML == "");
    t.assert("output", ui.output.hasAttribute("hidden"));
}

async function testInitDelay() {
    return new Promise((resolve, reject) => {
        t.log("testInitDelay...");
        const start = new Date();
        const snip = document.createElement("codapi-snippet");
        snip.setAttribute("sandbox", "python");
        snip.setAttribute("init-delay", "100");
        snip.addEventListener("load", () => {
            const elapsed = new Date() - start;
            t.assert("load", true);
            t.assert("init delay", elapsed >= 100);
            resolve();
        });
        const app = document.querySelector("#app");
        app.innerHTML = `<pre><code>print("hello")</code></pre>`;
        app.appendChild(snip);
    });
}

async function testAttachPrev() {
    t.log("testAttachPrev...");
    const ui = createSnippet(`
        <div>
            <div>print("hello")</div>
        </div>
        <codapi-snippet sandbox="python"></codapi-snippet>
    `);
    t.assertFunc("snippet code", () => {
        return ui.snip.code == `print("hello")`;
    });
}

async function testAttachParentPrev() {
    t.log("testAttachParentPrev...");
    const ui = createSnippet(`
        <div>
            <div>print("hello")</div>
        </div>
        <p>
            <codapi-snippet sandbox="python"></codapi-snippet>
        </p>
    `);
    t.assertFunc("snippet code", () => {
        return ui.snip.code == `print("hello")`;
    });
}

async function testAttachSelector() {
    t.log("testAttachSelector...");
    const ui = createSnippet(`
        <div id="playground">
            <pre class="code">print("hello")</pre>
        </div>
        <div>
            <codapi-snippet sandbox="python" selector="#playground .code"></codapi-snippet>
        </div>
    `);
    t.assertFunc("snippet code", () => {
        return ui.snip.code == `print("hello")`;
    });
}

async function testAttachSelectorPrev() {
    t.log("testAttachSelectorPrev...");
    const ui = createSnippet(`
        <div>
            <div>print("hello")</div>
        </div>
        <codapi-snippet sandbox="python" selector="@prev div"></codapi-snippet>
    `);
    t.assertFunc("snippet code", () => {
        return ui.snip.code == `print("hello")`;
    });
}

async function testEditorOff() {
    t.log("testEditorOff...");
    const ui = createSnippet(`
        <pre><code>print("hello")</code></pre>
        <codapi-snippet sandbox="python"></codapi-snippet>
    `);
    t.assert("editor", !ui.editor.hasAttribute("contenteditable"));
    t.assert("edit button", ui.toolbar.edit.hasAttribute("hidden"));
}

async function testEditorBasic() {
    t.log("testEditorBasic...");
    const ui = createSnippet(`
        <pre><code>print("hello")</code></pre>
        <codapi-snippet sandbox="python" editor="basic"></codapi-snippet>
    `);
    t.assert("editor", ui.editor.hasAttribute("contenteditable"));
    t.assert("edit button", !ui.toolbar.edit.hasAttribute("hidden"));
}

async function testEditorExternal() {
    t.log("testEditorExternal...");
    const ui = createSnippet(`
        <pre><code>print("hello")</code></pre>
        <codapi-snippet sandbox="python" editor="external"></codapi-snippet>
    `);
    t.assert("edit button", ui.toolbar.edit.hasAttribute("hidden"));
}

async function testEdit() {
    t.log("testEdit...");
    const ui = createSnippet(`
        <pre><code>print("hello")</code></pre>
        <codapi-snippet sandbox="python" editor="basic"></codapi-snippet>
    `);
    ui.toolbar.edit.click();
    t.assert("editor focus", document.activeElement == ui.editor);
}

async function testRun() {
    return new Promise((resolve, reject) => {
        t.log("testRun...");
        const ui = createSnippet(`
            <pre><code>print("hello")</code></pre>
            <codapi-snippet sandbox="python"></codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.id", result.id.startsWith("python_run"));
            t.assert("result.ok", result.ok);
            t.assert("result.duration", result.duration > 0);
            t.assert("result.stdout", result.stdout.trim() == "hello");
            t.assert("result.stderr", result.stderr == "");
            t.assert("status done", ui.status.innerHTML.includes("Done"));
            t.assert("output", ui.output.out.innerText.trim() == "hello");
            resolve();
        });
        ui.snip.addEventListener("error", () => {
            t.assert("on error", false);
        });
        ui.toolbar.run.click();
        t.assert("status running", ui.status.innerHTML.includes("Running"));
    });
}

async function testRunFailed() {
    return new Promise((resolve, reject) => {
        t.log("testRunFailed...");
        const ui = createSnippet(`
            <pre><code>print("hello")</code></pre>
            <codapi-snippet sandbox="python"></codapi-snippet>
        `);
        const { executor } = ui.snip;
        t.mock(executor.engine, "exec", () => {
            return { ok: false, stdout: "", stderr: "syntax error" };
        });
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.ok", !result.ok);
            t.assert("result.stdout", result.stdout == "");
            t.assert("result.stderr", result.stderr == "syntax error");
            t.assert("status done", ui.status.innerHTML.includes("Failed"));
            t.assert("output", ui.output.out.innerText.trim() == "syntax error");
            t.unmock(executor.engine, "exec");
            resolve();
        });
        ui.snip.addEventListener("error", () => {
            t.assert("on error", false);
        });
        ui.toolbar.run.click();
    });
}

async function testRunError() {
    return new Promise((resolve, reject) => {
        t.log("testRunError...");
        const ui = createSnippet(`
            <pre><code>print("hello")</code></pre>
            <codapi-snippet sandbox="python"></codapi-snippet>
        `);
        const { executor } = ui.snip;
        t.mock(executor.engine, "exec", () => {
            throw new Error("request failed");
        });
        ui.snip.addEventListener("result", () => {
            t.assert("on result", false);
        });
        ui.snip.addEventListener("error", (event) => {
            t.assert("error message", event.detail.message == "request failed");
            t.assert("status error", ui.status.innerHTML.includes("Failed"));
            t.assert("output", ui.output.out.innerText.trim() == "request failed");
            t.unmock(executor.engine, "exec");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testEditAndRun() {
    return new Promise((resolve, reject) => {
        t.log("testEditAndRun...");
        const ui = createSnippet(`
            <pre><code>console.log("hello")</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript"></codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.ok", result.ok);
            t.assert("result.stdout", result.stdout.trim() == "goodbye");
            t.assert("result.stderr", result.stderr == "");
            t.assert("status done", ui.status.innerHTML.includes("Done"));
            t.assert("output", ui.output.out.innerText.trim() == "goodbye");
            resolve();
        });
        ui.editor.innerText = `console.log("goodbye")`;
        ui.toolbar.run.click();
        t.assert("status running", ui.status.innerHTML.includes("Running"));
    });
}

async function testEngineBrowser() {
    return new Promise((resolve, reject) => {
        t.log("testEngineBrowser...");
        const ui = createSnippet(`
            <pre><code>console.log("hello")</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript"></codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.ok", result.ok);
            t.assert("result.stdout", result.stdout.trim() == "hello");
            t.assert("result.stderr", result.stderr == "");
            t.assert("status done", ui.status.innerHTML.includes("Done"));
            t.assert("output", ui.output.out.innerText.trim() == "hello");
            resolve();
        });
        ui.snip.addEventListener("error", () => {
            t.assert("on error", false);
        });
        ui.toolbar.run.click();
        t.assert("status running", ui.status.innerHTML.includes("Running"));
    });
}

async function testEngineWasi() {
    // load wasi engine
    const wasi = document.createElement("script");
    wasi.setAttribute("type", "module");
    wasi.setAttribute("src", "../src/engine/runno.js");
    document.body.appendChild(wasi);
    await t.wait(50);

    // perform test
    return new Promise((resolve, reject) => {
        t.log("testEngineWasi...");
        const ui = createSnippet(`
            <pre><code>print("hello")</code></pre>
            <codapi-snippet engine="wasi" sandbox="lua"></codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.ok", result.ok);
            t.assert("result.stdout", result.stdout.trim() == "hello");
            t.assert("result.stderr", result.stderr == "");
            t.assert("status done", ui.status.innerHTML.includes("Done"));
            t.assert("output", ui.output.out.innerText.trim() == "hello");
            resolve();
        });
        ui.snip.addEventListener("error", () => {
            t.assert("on error", false);
        });
        ui.toolbar.run.click();
        t.assert("status running", ui.status.innerHTML.includes("Running"));
    });
}

async function testCustomStatus() {
    return new Promise((resolve, reject) => {
        t.log("testCustomStatus...");
        const ui = createSnippet(`
            <pre><code>console.log("hello")</code></pre>
            <codapi-snippet
                engine="browser" sandbox="javascript"
                status-running="running!"
                status-failed="failed!"
                status-done="done!">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", () => {
            t.assert("status done", ui.status.innerHTML.includes("done!"));
            resolve();
        });
        ui.toolbar.run.click();
        t.assert("status running", ui.status.innerHTML.includes("running!"));
    });
}

async function testCustomSandbox() {
    return new Promise((resolve, reject) => {
        t.log("testCustomSandbox...");
        const ui = createSnippet(`
            <pre><code>print("hello")</code></pre>
            <codapi-snippet engine="codapi" sandbox="python:dev"></codapi-snippet>
        `);
        const { executor } = ui.snip;
        t.mock(executor.engine, "exec", () => {
            t.assert("request sandbox", executor.sandbox == "python");
            t.assert("request version", executor.version == "dev");
            return { ok: true, stdout: "hello", stderr: "" };
        });
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.ok", result.ok);
            t.unmock(executor.engine, "exec");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testCustomCommand() {
    return new Promise((resolve, reject) => {
        t.log("testCustomCommand...");
        const ui = createSnippet(`
            <pre><code>import unittest
class Test(unittest.TestCase):
    def test(self): pass</code></pre>
            <codapi-snippet sandbox="python" actions="Test:test"></codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.ok", result.ok);
            t.assert("status done", ui.status.innerHTML.includes("Done"));
            resolve();
        });
        ui.toolbar.querySelector(`[href="#test"]`).click();
        t.assert("status running", ui.status.innerHTML.includes("Running"));
    });
}

async function testCustomEvent() {
    t.log("testCustomEvent...");
    const ui = createSnippet(`
        <pre><code>print("hello")</code></pre>
        <codapi-snippet sandbox="python" actions="Share:@share"></codapi-snippet>
    `);
    ui.snip.addEventListener("share", (event) => {
        const code = event.target.code;
        t.assert("code", code == `print("hello")`);
    });
    ui.toolbar.querySelector(`[href="#share"]`).click();
}

async function testFallbackOutput() {
    return new Promise((resolve, reject) => {
        t.log("testFallbackOutput...");
        const ui = createSnippet(`
            <pre><code>print("hello")</code></pre>
            <codapi-snippet sandbox="python" output></codapi-snippet>
            <pre>hello</pre>
        `);
        const { executor } = ui.snip;
        t.mock(executor.engine, "exec", () => {
            throw new Error("request failed");
        });
        ui.snip.addEventListener("error", (event) => {
            t.assert("error message", event.detail.message == "request failed");
            t.assert("status error", ui.status.innerHTML.includes("Failed, using fallback"));
            t.assert("output", ui.output.out.innerText.trim() == "hello");
            t.unmock(executor.engine, "exec");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testHideOutput() {
    return new Promise((resolve, reject) => {
        t.log("testHideOutput...");
        const ui = createSnippet(`
            <pre><code>const n = 42;</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript"></codapi-snippet>
        `);
        ui.snip.addEventListener("result", () => {
            ui.output.close.click();
            t.assert("output hidden", ui.output.hasAttribute("hidden"));
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputLog() {
    return new Promise((resolve, reject) => {
        t.log("testOutputLog...");
        const ui = createSnippet(`
            <pre><code>console.log("hello")</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            t.assert("output", ui.output.out.innerHTML == "hello");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputReturn() {
    return new Promise((resolve, reject) => {
        t.log("testOutputReturn...");
        const ui = createSnippet(`
            <pre><code>return "hello"</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            t.assert("output", ui.output.out.innerHTML == "hello");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputLogAndReturn() {
    return new Promise((resolve, reject) => {
        t.log("testOutputLogAndReturn...");
        const ui = createSnippet(`
            <pre><code>console.log("hello"); return "goodbye";</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            t.assert("output", ui.output.out.innerHTML == "goodbye");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputModeDefault() {
    return new Promise((resolve, reject) => {
        t.log("testOutputModeDefault...");
        const ui = createSnippet(`
            <pre><code>console.log("&lt;em&gt;hello&lt;/em&gt;")</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript"></codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("output", ui.output.out.innerHTML == "&lt;em&gt;hello&lt;/em&gt;");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputModeText() {
    return new Promise((resolve, reject) => {
        t.log("testOutputModeText...");
        const ui = createSnippet(`
            <pre><code>console.log("&lt;em&gt;hello&lt;/em&gt;")</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript" output-mode="text">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            t.assert("output", ui.output.out.innerHTML == "&lt;em&gt;hello&lt;/em&gt;");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputModeTable() {
    return new Promise((resolve, reject) => {
        t.log("testOutputModeTable...");
        const ui = createSnippet(`
            <pre><code>console.log('[{"a":11},{"a":12}]')</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript" output-mode="table">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            t.assert(
                "output",
                ui.output.out.innerHTML ==
                    "<table><thead><tr><th>a</th></tr></thead><tbody><tr><td>11</td></tr><tr><td>12</td></tr></tbody></table>"
            );
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputModeSVG() {
    return new Promise((resolve, reject) => {
        t.log("testOutputModeSVG...");
        const ui = createSnippet(`
            <pre><code>console.log("&lt;svg&gt;hello&lt;/svg&gt;")</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript" output-mode="svg">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            t.assert("output", ui.output.out.innerHTML == "<svg>hello</svg>");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputModeHTML() {
    return new Promise((resolve, reject) => {
        t.log("testOutputModeHTML...");
        const ui = createSnippet(`
            <pre><code>console.log("&lt;em&gt;hello&lt;/em&gt;")</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript" output-mode="html">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            t.assert("output", ui.output.out.innerHTML == "<em>hello</em>");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputModeDOM() {
    return new Promise((resolve, reject) => {
        t.log("testOutputModeDOM...");
        const ui = createSnippet(`
            <pre><code>const el = document.createElement("em");
el.textContent = "hello";
return el;</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript" output-mode="dom">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            t.assert("output", ui.output.out.innerHTML == "<em>hello</em>");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testOutputModeHidden() {
    return new Promise((resolve, reject) => {
        t.log("testOutputModeHidden...");
        const ui = createSnippet(`
            <pre><code>console.log("hello")</code></pre>
            <codapi-snippet engine="browser" sandbox="javascript" output-mode="hidden">
            </codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            t.assert("output empty", ui.output.out.innerHTML == "");
            t.assert("output hidden", ui.output.hasAttribute("hidden"));
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testTemplate() {
    return new Promise((resolve, reject) => {
        t.log("testTemplate...");
        const ui = createSnippet(`
<script id="template" type="text/plain">
function say(msg) {
    console.log(msg)
}
##CODE##
</script>
<pre><code>say("saying hello")</code></pre>
<codapi-snippet engine="browser" sandbox="javascript" template="#template">
</codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.stdout", result.stdout.trim() == "saying hello");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testFiles() {
    return new Promise((resolve, reject) => {
        t.log("testFiles...");
        const ui = createSnippet(`
<script id="talker.py" type="text/plain">
def say(msg):
    print(msg)

##CODE##
</script>
<pre><code>
import talker
talker.say("saying hello")
</code></pre>
<codapi-snippet sandbox="python" files="#talker.py"></codapi-snippet>
        `);
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.stdout", result.stdout.trim() == "saying hello");
            resolve();
        });
        ui.toolbar.run.click();
    });
}

async function testDependsOn() {
    return new Promise((resolve, reject) => {
        t.log("testDependsOn...");
        const html = `
            <pre><code>console.log("step-1")</code></pre>
            <codapi-snippet id="step-1" engine="browser" sandbox="javascript">
            </codapi-snippet>
            <pre><code>console.log("step-2")</code></pre>
            <codapi-snippet id="step-2" engine="browser" sandbox="javascript" depends-on="step-1">
            </codapi-snippet>
            <pre><code>console.log("step-3")</code></pre>
            <codapi-snippet id="step-3" engine="browser" sandbox="javascript" depends-on="step-2">
            </codapi-snippet>
        `;
        const ui = createSnippet(html);
        ui.snip.addEventListener("result", (event) => {
            const result = event.detail;
            t.assert("result.ok", result.ok);
            t.assert("result.stdout", result.stdout.trim() == "step-1\nstep-2\nstep-3");
            t.assert("result.stderr", result.stderr == "");
            t.assert("status done", ui.status.innerHTML.includes("Done"));
            t.assert("output", ui.output.out.innerText.trim() == "step-1\nstep-2\nstep-3");
            resolve();
        });
        ui.toolbar.run.click();
        t.assert("status running", ui.status.innerHTML.includes("Running"));
    });
}

function createSnippet(html) {
    document.querySelector("#app").innerHTML = html;
    const editor = document.querySelector("#app pre:last-of-type code");
    const snip = document.querySelector("#app codapi-snippet:last-of-type");
    const toolbar = snip.querySelector("codapi-toolbar");
    toolbar.run = toolbar.querySelector("button");
    toolbar.edit = toolbar.querySelector("a");
    const status = snip.querySelector("codapi-status");
    const output = snip.querySelector("codapi-output");
    output.out = output.querySelector("pre code");
    output.close = output.querySelector("a");
    return { editor, snip, toolbar, status, output };
}

export default { runTests };
