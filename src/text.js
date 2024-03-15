// Text handling.

const HORIZONTAL_RULE = "---";

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
    if (s.endsWith(HORIZONTAL_RULE)) {
        return "";
    }
    const index = s.lastIndexOf(`\n${HORIZONTAL_RULE}\n`);
    if (index !== -1) {
        return s.slice(index + HORIZONTAL_RULE.length + 2);
    }
    if (s.startsWith(HORIZONTAL_RULE)) {
        return s.slice(HORIZONTAL_RULE.length + 1);
    }
    return s;
}

export default { cut, tail, HORIZONTAL_RULE };
