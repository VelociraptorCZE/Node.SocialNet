const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const FlashMessage = require("./service/flash-messages");
const RandomWordGenerator = require("./service/RandomWordGenerator");

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: RandomWordGenerator({ min: 40, max: 45 }),
    resave: false,
    saveUninitialized: false
}));

// presenters
const homepagePresenter = require("./presenters/HomepagePresenter");
const signUpPresenter = require("./presenters/SignUpPresenter");
const signInPresenter = require("./presenters/SignInPresenter");
const profilePresenter = require("./presenters/ProfilePresenter");
const findPresenter = require("./presenters/FindPresenter");
// actions
const newAccount = require("./actions/NewAccount");
const logToAccount = require("./actions/LogToAccount");
const logOut = require("./actions/LogOut");
const addPost = require("./actions/AddPost");
const followAction = require("./actions/FollowAction");
// flashMessage
const flashMessage = new FlashMessage();

app.get("/", (request, resource) => {
    homepagePresenter(request, resource, flashMessage);
});

app.get("/sign-up", (request, resource) => {
    signUpPresenter(request, resource, flashMessage);
});

app.get("/sign-in", (request, resource) => {
    signInPresenter(request, resource, flashMessage);
});

app.get("/profile", (request, resource) => {
    profilePresenter(request, resource);
});

app.get("/find", (request, resource) => {
    findPresenter(request, resource);
});

// actions

app.get("/log-out", (request, resource) => {
    logOut(request, resource, flashMessage);
});

app.post("/log-to-account", (request, resource) => {
    logToAccount(request, resource, flashMessage);
});

app.post("/new-account", (request, resource) => {
    newAccount(request, resource, flashMessage);
});

app.post("/add-post", (request, resource) => {
    addPost(request, resource, flashMessage);
});

app.get("/follow", (request, resource) => {
    followAction(request, resource);
});

app.get("/add-post", (_, resource) => {
    resource.redirect("/");
});

app.listen(8080);