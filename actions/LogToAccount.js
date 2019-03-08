const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

module.exports = (request, resource, flashMessage) => {
    const { nick, password } = request.body;
    const login = mysql.createConnection(db);

    login.connect();

    login.query("select * from users where nick = ? limit 1", [nick], (_, result) => {
        result = result[0] || { pass: "" };
        const comparison = bcrypt.compareSync(password, result.pass);
        if (comparison) {
            request.session.user = {
                id: result.id,
                nick: result.nick,
                logged: true
            };
            resource.redirect("/");
        }
        else {
            flashMessage.set({ content: "Wrong password, try it again.", class: "error" });
            resource.redirect("/sign-in");
        }
    });
};