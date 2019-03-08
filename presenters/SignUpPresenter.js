const template = require("../service/template");

module.exports = (request, resource, flashMessage) => {
    if (request.session.user) {
        resource.redirect("/");
        return;
    }
    const signup = template("./views/signup.pug", {
        flash: flashMessage.get()
    });
    flashMessage.clear();
    resource.send(signup);
};