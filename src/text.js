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

export default { cut };
