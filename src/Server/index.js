require("dotenv").config();

const express = require("express"),
    https = require("https"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    multer = require('multer'),
    fs = require("fs"),
    session = require("express-session");

const loginStrategy = require("../Strategies/login")
const uploadHandler = require("./PostRequestHandlers/upload"),
    loginHandler = require("./PostRequestHandlers/login"),
    registerHandler = require("./PostRequestHandlers/register");

const app = express();
const server = https.createServer({
    key: fs.readFileSync(`${__dirname}/certs/server.key`),
    cert: fs.readFileSync(`${__dirname}/certs/server.cert`)
}, app);
const upload = multer({
    dest: `${__dirname}/uploads`
});

passport.use("local", loginStrategy);
app.set("view engine", "pug");
app.use("/public", express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: "iL0vE_C0MP3335_D4t4b4se"
}))
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

/*Routes */
app.post("/login", passport.authenticate("local"), loginHandler);
app.post("/upload", upload.single("file"), uploadHandler);
app.post("/register", registerHandler);
app.get("/", (req, res) => res.render('index'))
app.get("/login", (req, res) => res.render("login"))
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})
app.get("/register", (req, res) => res.render("register"))
app.get("/profile", (req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}, (req, res) => res.render("profile", {
    user: req.user
}))
/*End of Routes */

/* Public Functions */
module.exports = {
    start: () => server.listen(process.env.PORT || 443, () => console.log(`Server Started, Listening on: ${process.env.PORT}`)),
    app: app,
    port: process.env.PORT,
    use: obj => app.use(obj)
}