module.exports = function () {
    const _default = "default";
    this.messages = {};

    this.set = (content, id = _default) => {
        this.messages[id] = content;
    };

    this.get = (id = _default) => {
        return this.messages[id];
    };

    this.clear = (id = _default) => {
        delete this.messages[id];
    }
};