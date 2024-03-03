// Automated testing support.

// T is a helper for asserting, mocking, and logging during testing.
class T {
    console = document.querySelector("#console");

    constructor(name, isDebug) {
        this.name = name;
        this.isDebug = isDebug ?? false;
        this.errorCount = 0;
    }

    // assert checks if the condition is true and logs the error if it is not.
    assert(desc, condition) {
        if (condition) {
            this.debug(`  ✔ ${desc}`);
        } else {
            this.errorCount++;
            this.log(`  ✘ ${desc}`);
        }
    }

    // assertFunc checks if the function returns true, otherwise fails.
    // Also fails if the function throws an error.
    assertFunc(desc, func) {
        try {
            const ok = func();
            this.assert(desc, ok);
        } catch {
            this.errorCount++;
            this.log(`  ✘ ${desc}`);
        }
    }

    // log prints a message.
    log(message) {
        const line = `${this.name}: ${message}`;
        this.console.appendChild(document.createTextNode(line + "\n"));
        console.log(line);
    }

    // debug prints a message if the debug mode is on.
    debug(message) {
        const line = `${this.name}: ${message}`;
        if (this.isDebug) {
            this.console.appendChild(document.createTextNode(line + "\n"));
        }
        console.log(line);
    }

    // summary prints the test summary.
    summary() {
        if (this.errorCount) {
            this.log(`✘ FAILED with ${this.errorCount} errors`);
        } else {
            this.log(`✔ All tests passed`);
        }
    }

    // mock replaces the object property with a replacement,
    // preserving the original value for future unmocking.
    mock(obj, property, repacement) {
        obj[`${property}.mocked`] = obj[property];
        obj[property] = repacement;
    }

    // unmock restores the original object property value
    // that was previously mocked.
    unmock(obj, property) {
        obj[property] = obj[`${property}.mocked`];
        delete obj[`${property}.mocked`];
    }

    // wait sleeps for the specified number of milliseconds.
    wait(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(ms);
            }, ms);
        });
    }
}

export default { T };
