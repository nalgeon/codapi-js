const defaultTimeout = 10000;

// fetchTimeout is a wrapper around the Fetch API with timeout support.
async function fetchTimeout(resource, options = {}) {
    const { timeout = defaultTimeout } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
    });
    clearTimeout(id);

    return response;
}

export { fetchTimeout };
