// sanitize strips HTML from the text.
function sanitize(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

export { sanitize };
