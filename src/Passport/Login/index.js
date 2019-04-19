const localStrategy = require("passport-local").Strategy;
const Database = require("../../Database");
const Encryption = require("../../Encryption");

module.exports = new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async (req, email, password, done) => {
    if(email == null) return done(null, false, req.flash("loginMessage", `Error: Invalid Email.`))
    if(password == null) return done(null, false, req.flash("loginMessage", `Invalid Password.`));
    try{
        const emailExists = await Database.emailExists(email);
        if(!emailExists) return done(null, false, req.flash("loginMessage", "ERROR: Email have not been registered."));

        const user = await Database.getUserByEmail(email);
        if(!Encryption.bcryptCompare(password, user.password)) return done(null, false, req.flash("loginMessage", "ERROR: Incorrect Password."));

        if(req.body.remember) req.session.cookie.maxAge = 1000 * 60 * 30;
        else req.session.cookie.expires = false;

        return done(null, user);

    }catch(e){
        console.log(e);
        return done(null, false, req.flash("loginMessage", "ERROR: Some Error occured, Try again later."))
    }
    
})