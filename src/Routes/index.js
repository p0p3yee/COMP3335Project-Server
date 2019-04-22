const multer = require('multer');

const   upload = multer({
            dest: `${__dirname}/../../uploads`
        }),
        uploadHandler = require("../RequestHandlers/Post/upload"),
        ipfsHandler = require("../RequestHandlers/Post/ipfs"),
        forgotHandler = require("../RequestHandlers/Post/forgot"),
        profileHandler = require("../RequestHandlers/Post/profile"),
        filesHandler = require("../RequestHandlers/Get/files"),
        shareViaEmail = require("../RequestHandlers/Post/shareViaEmail"),
        fileDeleteHandler = require("../RequestHandlers/Post/fileDelete"),
        fileUpdateHandler = require("../RequestHandlers/Post/fileUpdate"),
        downloadHandler = require("../RequestHandlers/Get/downloadHandler"),
        shareHandler = require("../RequestHandlers/Get/shareHandler"),
        sharePageHandler = require("../RequestHandlers/Get/sharePageHandler"),
        shareUpdateHandler = require("../RequestHandlers/Post/shareUpdateHandler");

const loggedIn = (req, res, next) => req.user ? res.redirect("/profile") : next();
const authed = (req, res, next) =>{
    if(req.isAuthenticated()) return next();
    req.flash("loginMessage", "Error: Please Login First.");
    res.redirect("/login");
}

module.exports = (app, passport) => {
    app.post("/login", passport.authenticate("login", {
        successRedirect: "/profile",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: true
    }));
    app.post("/upload", upload.single("file"), uploadHandler);
    app.post("/ipfs", upload.single("file"), ipfsHandler);
    app.post("/register", passport.authenticate("register", {
        successRedirect: "/profile",
        failureRedirect: "/register",
        failureFlash: true,
        successFlash: true
    }))
    app.post("/forgot", forgotHandler);
    app.post("/profile", (req, res, next) => req.user ? next() : res.redirect("/login"), profileHandler);
    app.get("/", (req, res) => res.render("index", {
        user: req.user,
        failMessage: req.flash("failMessage")
    }))
    app.get("/upload", authed, (req, res) => res.render("upload", {
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
    app.get("/profile", authed, (req, res) => res.render("profile", {
        user: req.user,
        successMessage: req.flash("registerMessage"),
        message: req.flash("profileMessage")
    }))
    app.get("/share", authed, sharePageHandler);
    app.get("/share/:hash", shareHandler);
    app.get("/download/:link", downloadHandler)
    app.get("/files", authed, filesHandler)
    app.post("/files/delete", authed, fileDeleteHandler)
    app.post("/files/update", authed, fileUpdateHandler);
    app.post("/share/update", authed, shareUpdateHandler);
    app.post("/share/email", authed, shareViaEmail)
}