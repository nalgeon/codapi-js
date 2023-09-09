// Custom actions.

const specRE = /^([^:]+):(@?\S+)$/;

// An Action describes a Codapi action.
// It's either a command or an event.
class Action {
    constructor(title, type, value) {
        this.title = title;
        this.type = type;
        this.value = value;
    }

    // parse creates an Action from a text representation:
    // [Run tests]command=test -> Action("Run tests", "command", "test")
    static parse(spec) {
        const match = specRE.exec(spec);
        if (!match) {
            return null;
        }
        const title = match[1].replaceAll("_", " ");
        const type = match[2][0] == "@" ? "event" : "command";
        const value = match[2][0] == "@" ? match[2].slice(1) : match[2];
        return new Action(title, type, value);
    }
}

export { Action };
