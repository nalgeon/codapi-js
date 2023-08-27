// Execute HTTP request from a spec.

// exec sends an HTTP request according to the specification.
async function exec(url, data) {
    try {
        const spec = parse(data.files[""]);
        spec.url = enforceUrl(spec.url, url);
        const [message, elapsed] = await execCode(spec);
        return {
            ok: true,
            duration: elapsed,
            stdout: message,
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

// parse parses the request specification.
function parse(text) {
    const lines = text.split("\n");
    let lineIdx = 0;

    // Pparse method and URL
    const [method, url] = lines[0].split(" ");
    lineIdx += 1;

    // parse URL parameters
    let queryParams = "";
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("?") || line.startsWith("&")) {
            queryParams += line;
            lineIdx += 1;
        } else {
            break;
        }
    }

    // parse headers
    const headers = {};
    for (let i = lineIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === "") {
            break;
        }
        const [headerName, headerValue] = line.split(": ");
        headers[headerName] = headerValue;
        lineIdx += 1;
    }

    // parse body
    const body = lines.slice(lineIdx + 1).join("\n");

    return {
        method,
        url: url + queryParams,
        headers,
        body,
    };
}

// enforceUrl enforces the base url (if any).
function enforceUrl(uri, baseUri) {
    if (!baseUri) {
        return uri;
    }
    const url = new URL(uri);
    const baseUrl = new URL(baseUri);
    url.protocol = baseUrl.protocol;
    url.username = baseUrl.username;
    url.password = baseUrl.password;
    url.host = baseUrl.host;
    url.pathname = baseUrl.pathname;
    return url.href;
}

// execCode sends an HTTP request according to the spec
// and returns the response as text with status, headers and body.
async function execCode(spec) {
    const start = new Date();
    const resp = await sendRequest(spec);
    const text = await responseText(resp);
    const elapsed = new Date() - start;
    return [text, elapsed];
}

// sendRequest sends an HTTP request according to the spec.
async function sendRequest(spec) {
    const options = {
        method: spec.method,
        headers: spec.headers,
        body: spec.body || undefined,
    };
    return await fetch(spec.url, options);
}

// responseText returns the response as text
// with status, headers and body.
async function responseText(resp) {
    // there is no way to tell the protocol version
    // from the response, so let it always be 1.1
    const version = "HTTP/1.1";
    const text = await resp.text();
    const messages = [`${version} ${resp.status} ${resp.statusText}`];
    for (const hdr of resp.headers.entries()) {
        messages.push(`${hdr[0]}: ${hdr[1]}`);
    }
    if (text) {
        messages.push("", text);
    }
    return messages.join("\n");
}

export default { exec };
