// Automated testing support.

const engine = {
    debug: false,
    errorCount: 0,
    console: document.querySelector("#console"),
    mocked: {},
};

// assert checks if the condition is true and logs the error if it is not.
function assert(desc, condition) {
    if (condition) {
        debug(`  ✔ ${desc}`);
    } else {
        engine.errorCount++;
        log(`  ✘ ${desc}`);
    }
}

// assertFunc checks if the function returns true, otherwise fails.
// Also fails if the function throws an error.
function assertFunc(desc, func) {
    try {
        const ok = func();
        assert(desc, ok);
    } catch {
        engine.errorCount++;
        log(`  ✘ ${desc}`);
    }
}

// log prints a message.
function log(message) {
    const line = document.createTextNode(message + "\n");
    engine.console.appendChild(line);
    console.log(message);
}

// debug prints a message if the debug mode is on.
function debug(message) {
    if (engine.debug) {
        const line = document.createTextNode(message + "\n");
        engine.console.appendChild(line);
    }
    console.log(message);
}

// summary prints the test summary.
function summary() {
    if (engine.errorCount) {
        log(`✘ FAILED with ${engine.errorCount} errors`);
    } else {
        log("✔ All tests passed");
    }
}

// mock replaces the object property with a replacement,
// preserving the original value for future unmocking.
function mock(obj, property, repacement) {
    obj[`${property}.mocked`] = obj[property];
    obj[property] = repacement;
}

// unmock restores the original object property value
// that was previously mocked.
function unmock(obj, property) {
    obj[property] = obj[`${property}.mocked`];
    delete obj[`${property}.mocked`];
}

// wait sleeps for the specified number of milliseconds.
function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(ms);
        }, ms);
    });
}

export default { assert, assertFunc, log, debug, summary, mock, unmock, wait };
