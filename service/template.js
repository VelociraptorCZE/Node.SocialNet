const pug = require("pug");

module.exports = (url, vars = {}) => {
    const template = pug.compileFile(url);
    return template(vars);
};