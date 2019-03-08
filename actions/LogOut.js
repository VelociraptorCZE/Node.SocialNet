module.exports = (request, resource, flashMessage) => {
    delete request.session.user;
    flashMessage.set({ content: "You were just logged out", class: "info" });
    resource.redirect("/");
};