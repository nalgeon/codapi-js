// cut slices s around the first instance of sep,
// returning the text before and after sep.
// If sep does not appear in s, cut returns [s, ""].
function cut(s, sep) {
    const index = s.indexOf(sep);
    if (index >= 0) {
        return [s.slice(0, index), s.slice(index + sep.length)];
    }
    return [s, ""];
}

// sanitize strips HTML from the text.
function sanitize(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

export default { cut, sanitize };
