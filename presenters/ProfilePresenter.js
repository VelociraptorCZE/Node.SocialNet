const db = require("../config/db");
const mysql = require("mysql");
const template = require("../service/template");

module.exports = (request, resource) => {
    const postQuery = mysql.createConnection(db);
    postQuery.connect();

    const user = request.session.user;
    const userId = (user || {}).userId || resource.req._parsedUrl.query;

    if (!userId) {
        resource.redirect("/");
        return;
    }

    postQuery.query("select * from posts where userId = ?", [userId], (_, posts) => {
        const userQuery = mysql.createConnection(db);
        userQuery.connect();
        userQuery.query("select * from users where id = ?", [userId], (_, userResponse) => {
            const _user = {
                ...userResponse[0],
                logged: !!user,
                loggedAs: user ? user.nick : void 0
            };
            if (user) {
                _user.id = user.id;
            }
            const homepage = template("./views/profile.pug", {
                user: _user,
                posts: posts.reverse()
            });
            resource.send(homepage);
        });
    });
};