const colors = {
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
}

const methodColorMap = {
    get: colors.green,
    post: colors.cyan,
    put: colors.yellow,
    delete: colors.red
}

export const logger = () => (res, req, next) => {
    const coloredMethod = (method = "") => {
        return `${methodColorMap[method.toLocaleLowerCase()]}${method}${colors.reset}`
    };
    const log = `${coloredMethod(res.method)}.${res.url}`;
    console.log(log);
    next();
}
