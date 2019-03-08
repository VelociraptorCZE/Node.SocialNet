const mysql = require("mysql");
const db = require("../config/db");

module.exports = (request, resource, flashMessage) => {
    const addPost = mysql.createConnection(db);
    const user = request.session.user;
    const content = request.body.postContent || [];

    if (user && content.length) {
        addPost.connect();
        addPost.query("insert into posts (content, userId, userNick) values (?, ?, ?)", [content, user.id, user.nick]);
        flashMessage.set({ content: "You post has been successfully sent.", class: "info" });
        addPost.end();
    }
    else {
        flashMessage.set({ content: "You post hasn't been sent.", class: "error" });
    }

    resource.redirect("/");
};