// tail separator
const TAIL_SEPARATOR = "---";

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

// tail returns the last part of s after the separator line.
// If s does not contain a separator, returns s unchanged.
function tail(s) {
    const index = s.lastIndexOf(`\n${TAIL_SEPARATOR}`);
    return index === -1 ? s : s.slice(index + 5);
}

export default { cut, tail };
