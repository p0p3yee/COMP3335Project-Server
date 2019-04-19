const multer = require('multer');

const uploadHandler = require("../PostRequestHandlers/upload");
const forgotHandler = require("../PostRequestHandlers/forgot");
const profileHandler = require("../PostRequestHandlers/profile");

const upload = multer({
    dest: `${__dirname}/../../uploads`
});

const loggedIn = (req, res, next) => req.user ? res.redirect("/profile") : next();

module.exports = (app, passport) => {
    app.post("/login", passport.authenticate("login", {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: true
    }));
    app.post("/upload", upload.single("file"), uploadHandler);
    app.post("/register", passport.authenticate("register", {
        successRedirect: "/profile",
        failureRedirect: "/register",
        failureFlash: true,
        successFlash: true
    }))
    app.post("/forgot", forgotHandler);
    app.post("/profile", (req, res, next) => req.user ? next() : res.redirect("/login"), profileHandler);
    app.get("/", (req, res) => res.render('index', {
        user: req.user
    }))
    app.get("/login", loggedIn, (req, res) => res.render("login", {
        message: req.flash("loginMessage"),
        successMessage: req.flash("registerMessage")
    }))
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    })
    app.get("/register", loggedIn, (req, res) => res.render("register", {
        message: req.flash("registerMessage")
    }))
    app.get("/forgot", loggedIn, (req, res) => res.render("forgot", {
        message: req.flash("failedMessage"),
        successMessage: req.flash("successMessage")
    }))
    app.get("/profile", (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.flash("loginMessage", "Error: Please Login First.");
        res.redirect("/login");
    }, (req, res) => res.render("profile", {
        user: req.user,
        successMessage: req.flash("registerMessage"),
        message: req.flash("profileMessage")
    }))
}