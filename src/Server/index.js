require("dotenv").config();

const express = require("express"),
    https = require("https"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    fs = require("fs"),
    session = require("express-session"),
    flash = require('connect-flash');

const app = express();

require("../Passport")(passport);

const server = https.createServer({
    key: fs.readFileSync(`${__dirname}/certs/server.key`),
    cert: fs.readFileSync(`${__dirname}/certs/server.cert`)
}, app);

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
app.use(flash());

/*Routes */
require("../Routes")(app, passport);
/*End of Routes */

/* Public Functions */
module.exports = {
    start: () => server.listen(process.env.PORT || 443, () => console.log(`Server Started, Listening on: ${process.env.PORT}`)),
    app: app,
    port: process.env.PORT,
    use: obj => app.use(obj)
}