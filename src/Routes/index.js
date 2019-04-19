const multer = require('multer');

const uploadHandler = require("../PostRequestHandlers/upload");
const forgotHandler = require("../PostRequestHandlers/forgot");

const upload = multer({
    dest: `${__dirname}/../../uploads`
});

module.exports = (app, passport) => {
    app.post("/login", passport.authenticate("login", {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: true
    }));
    app.post("/upload", upload.single("file"), uploadHandler);
    app.post("/register", passport.authenticate("register", {
        successRedirect: "/login",
        failureRedirect: "/register",
        failureFlash: true,
        successFlash: true
    }))
    app.post("/forgot", forgotHandler);
    app.get("/", (req, res) => res.render('index'))
    app.get("/login", (req, res, next) => {
        if(req.user){
            res.redirect("/profile")
        }else{
            return next();
        }
    }, (req, res) => res.render("login", {
        message: req.flash("loginMessage"),
        successMessage: req.flash("registerMessage")
    }))
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    })
    app.get("/register", (req, res) => res.render("register", {
        message: req.flash("registerMessage")
    }))
    app.get("/forgot", (req, res) => res.render("forgot", {
        message: req.flash("failedMessage"),
        successMessage: req.flash("successMessage")
    }))
    app.get("/profile", (req, res, next) => {
        if(req.isAuthenticated()) return next();
        res.redirect("/login");
    }, (req, res) => res.render("profile", {
        user: req.user
    }))
}