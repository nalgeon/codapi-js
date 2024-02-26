// Execute code using PGlite.

import { codobj } from "../codobj.js";

const { PGlite } = window;
let db;

// init downloads the runtime and creates a new database.
async function init() {
    if (!db) {
        db = new PGlite();
    }
    return db;
}

// exec executes a query command using PGlite.
async function exec(req) {
    try {
        const db = await init();
        const start = new Date();
        const res = await db.query(req.files[""]);
        return {
            ok: true,
            duration: new Date() - start,
            stdout: res,
            stderr: "",
        };
    } catch (exc) {
        return {
            ok: false,
            duration: 0,
            stdout: "",
            stderr: exc.toString(),
        };
    }
}

// add the engine to the registry
codobj.engines = {
    ...codobj.engines,
    ...{ pglite: { init, exec } },
};

export default { init, exec };
