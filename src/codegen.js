// Code generation.

import text from "./text.js";

const HR = text.HORIZONTAL_RULE;
const horRules = {
    javascript: `console.log("${HR}");`,
    lua: `print("${HR}")`,
    php: `echo "${HR}"`,
    python: `print("${HR}")`,
    r: `cat("${HR}\n")`,
    ruby: `puts "${HR}"`,
    typescript: `console.log("${HR}");`,
    shell: `echo "${HR}"`,
    sql: `select '${HR}';`,
};

// print a horizontal rule.
function hr(syntax) {
    return horRules[syntax] || "";
}

export default { hr };
