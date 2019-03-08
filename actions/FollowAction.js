const db = require("../config/db");
const mysql = require("mysql");
const getFollowList = require("../service/getFollowList");

module.exports = (request, resource) => {
    const user = request.session.user;
    const [followId, actionMode, ajax] = resource.req._parsedUrl.query.split("&");
    const getUserFollows = mysql.createConnection(db);
    getUserFollows.connect();

    if (user && followId && actionMode) {
        getUserFollows.query("select * from users where id = ? limit 1", [user.id], (_, _user) => {
            let followList = getFollowList(_user[0].followList);

            if (actionMode === "remove") {
                followList = followList.filter(follow => follow !== Number(followId));
            }
            else if (actionMode === "add") {
                followList.push(followId);
            }
            else {
                resource.redirect("/");
                return;
            }

            const setUserFollows = mysql.createConnection(db);
            setUserFollows.connect();
            setUserFollows.query("update users set followList = ? where id = ?", [followList.join(), user.id]);
            if (ajax) {
                const newContent = {};
                if (actionMode === "remove") {
                    newContent.action = "add";
                    newContent.content = "Follow";
                }
                else {
                    newContent.action = "remove";
                    newContent.content = "Unfollow";
                }
                resource.send({ ...newContent, oldAction: actionMode });
                return;
            }
            resource.redirect(request.headers.referer || "/");
        });
    }
    else {
        resource.redirect("/");
    }
};