let currentLevel = 2; // error level on production

function tagLog(tag: string, color: string | string[], params: any[]): void {

    const idd: string[] = params.map(item => {
        switch (typeof item) {
            case "string":
                return "%s";
            case "boolean":
                return "%o";
            case "number":
                return (0 ^ item) === item ? "%i" : "%f";
            default:
                return "%O";
        }
    });
    const isArray = Array.isArray(color);
    const tagFormat = `background-color:${isArray ? color[0] : color}; color:white`;
    const textFormat = isArray ? `color: ${color[1]}` : "";
    window.console.log.apply(console, [`Game: %c #%s %c ${idd.join(" ")}`, tagFormat, tag, textFormat].concat(params));
}

const trace = (...params: any[]): void => {
    if (currentLevel >= 6) {
        tagLog("trace", ["#ccc", "#aaa"], params);
    }
};
const debug = (...params: any[]): void => {
    if (currentLevel >= 5) {
        tagLog("debug", ["#0e7c1c", "#115816"], params);
    }
};
const warn = (...params: any[]): void => {
    if (currentLevel >= 4) {
        tagLog("warn", ["#ffcd84", "#ff5b0c"], params);
    }
};
const error = (...params: any[]): void => {
    if (currentLevel >= 3) {
        tagLog("error", ["#f31", "#f00"], params);
    }
};
const info = (...params: any[]): void => {
    if (currentLevel >= 2) {
        tagLog("info", ["#4454FF", "#4454FF"], params);
    }
};
const fatal = (...params: any[]): void => {
    if (currentLevel >= 1) {
        tagLog("fatal", "#7c002a", params);
    }
};
const setLevel = (level: number): void => {
    currentLevel = level;
};

export {
    trace, debug, info, error, fatal, warn,
    trace as log_trace,
    debug as log_debug,
    warn as log_warn,
    info as log_info,
    setLevel as log_level_set,
    error as log_error,
    fatal as log_fatal,
    tagLog,
};
