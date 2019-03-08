const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const EzValidator = require("../service/ezvalidator");

module.exports = (request, resource, flashMessage) => {
    const { nick, password } = request.body;
    const userCheck = mysql.createConnection(db);
    const validator = new EzValidator({
        name: {
            regex: /^\w{6,}$/,
            onInvalid: "Name must contain at least 6 characters!"
        }
    });

    userCheck.connect();

    userCheck.query("select * from users where nick = ?", [nick], (_, result) => {
        const isValid = validator.validate([
            { value: nick, rule: "name" },
            { value: password, rule: "password" }
        ]);
        const alreadyRegistered = !!result.length;
        if (alreadyRegistered || !isValid.result) {
            flashMessage.set(alreadyRegistered
                ? { content: "Nickname is already taken.", class: "error" }
                : { content: isValid.reason, class: "error" }
            );
            resource.redirect("/sign-up");
        }
        else {
            createNewUser(nick, password, flashMessage, () => resource.redirect("/"));
        }
    });

    userCheck.end();
};

function createNewUser(nick, password, flashMessage, successCallback = new Function()) {
    const newUser = mysql.createConnection(db);
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    newUser.connect();

    newUser.query("insert into users (nick, pass) values (?, ?)", [nick, hashPass], req => {
        if (req === null) {
            flashMessage.set({ content: "Your account has been successfully created.", class: "info" });
            successCallback();
        }
    });

    newUser.end();
}