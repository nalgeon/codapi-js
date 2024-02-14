// Global Codapi object.

const codobj = window.codapi ?? {};
codobj.version = typeof VERSION !== "undefined" ? VERSION : "main";
codobj.engines = codobj.engines ?? {};

window.codapi = codobj;
export default codobj;
