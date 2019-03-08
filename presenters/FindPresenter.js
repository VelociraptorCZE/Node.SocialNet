const db = require("../config/db");
const mysql = require("mysql");
const template = require("../service/template");
const getFollowList = require("../service/getFollowList");

module.exports = (request, resource) => {
    const findQuery = mysql.createConnection(db);
    findQuery.connect();

    const user = request.session.user;
    const query = resource.req._parsedUrl.query;
    const sqlQuery = `%${query}%`;

    if (query && user) {
        findQuery.query("select * from users where nick like ?", [sqlQuery], (_, queries) => {
            const userFollowListQuery = mysql.createConnection(db);
            userFollowListQuery.connect();
            userFollowListQuery.query("select * from users where id = ? limit 1", [user.id], (_, _user) => {
                const find = template("./views/find.pug", {
                    user: user,
                    followList: getFollowList(_user[0].followList),
                    queries: queries || [],
                    _query: query
                });
                resource.send(find);
            });
        });

        findQuery.end();
    }
    else {
        resource.redirect("/");
    }

};