const localStrategy = require("passport-local").Strategy;
const mysql = require("mysql2/promise");
const Database = require("../../Database");
const Encryption = require("../../Encryption");

module.exports = new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async (req, email, password, done) => {
    if(email == null) return done(null, false, req.flash("registerMessage", "Error: Invalid Email."))
    if(password == null) return done(null, false, req.flash("registerMessage", "Error: Invalid Password."))

    try{
        if(!Database.inited) throw new Error("Database not inited");

        const emailExists = await Database.emailExists(email);

        if(emailExists) return done(null, false, req.flash("registerMessage", "Error: Email already exists."));

        const insertResult = await Database.insertNewUser(email, password);
        
        if(insertResult.affectedRows >= 1) return done(null, {
            email: email,
            password: password,
            id: insertResult.userID
        }, req.flash("registerMessage", `Verification Email have been sent to ${email}.`));
        
        return done(null, false, req.flash("registerMessage", "Error: Some Error occured, Try again later."))
    
    }catch(e){
        console.log(e)
        return done(null, false, req.flash("registerMessage", "Error: Some Error occured, Try again later."))
    }
    
})