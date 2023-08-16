// Execute code using the sandbox server API.

const defaultUrl = "https://codapi.antonz.org/v1";

// An Executor runs the code and shows the results.
class Executor {
    constructor({ lang, template, url }) {
        this.lang = lang;
        this.template = template;
        this.apiUrl = url || defaultUrl;
    }

    // execute runs the code and shows the results.
    async execute(code) {
        code = await this.prepare(code);
        const result = await exec({
            apiUrl: this.apiUrl,
            lang: this.lang,
            command: "run",
            code: code,
        });
        return result;
    }

    // prepare preprocesses code before execution.
    async prepare(code) {
        if (!this.template) {
            return Promise.resolve(code);
        }
        const placeholder = "// {{ CODE }}";
        const template = await readFile(this.template);
        code = template.replace(placeholder, code);
        return code;
    }
}

// readFile fetches the remote file
// and returns its contents as text.
async function readFile(path) {
    const resp = await fetch(path);
    return await resp.text();
}

// exec executes a specific command
// using a sandbox server API.
async function exec({ apiUrl, lang, command, code }) {
    const url = `${apiUrl}/exec`;
    const data = { lang, command, code };
    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await resp.json();
}

export { Executor };
