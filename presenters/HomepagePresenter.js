const template = require("../service/template");
const mysql = require("mysql");
const db = require("../config/db");
const getFollowList = require("../service/getFollowList");

module.exports = (request, resource, flashMessage) => {
    const user = request.session.user;

    if (user) {
        const getUser = mysql.createConnection(db);
        getUser.connect();

        getUser.query("select * from users where id = ? limit 1", [user.id], (_, _user) => {
            const followList = getFollowList(_user[0].followList);
            const getPosts = mysql.createConnection(db);
            const userIds = followList.map(id => ` userId = ${id} `).join("or");
            getPosts.connect();
            getPosts.query(`select * from posts where ${userIds}`, (_, posts) => {
                resource.send(renderPage(flashMessage, user, posts));
                flashMessage.clear();
            });
        });
    }
    else {
        resource.send(renderPage(flashMessage, user));
        flashMessage.clear();
    }
};

const renderPage = (flashMessage, user, posts = []) => {
    return template("./views/homepage.pug", {
        user: user,
        homepageFlash: flashMessage.get(),
        posts: posts
    });
};