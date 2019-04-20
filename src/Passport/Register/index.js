const localStrategy = require("passport-local").Strategy;
const Verf = require("../../SendGrid");
const crypto = require("../../Encryption");
const Database = require("../../Database");


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
        
        if(!crypto.bcryptCompare(req.body.confPassword, password)) return done(null, false, req.flash("registerMessage", "Error: Password not the same."));

        const verfCode = Verf.generateCode();

        const insertResult = await Database.insertNewUser(email, password, verfCode);
        
        if(insertResult.affectedRows >= 1){
            const sendResult = await Verf.send(email, "COMP3335 Group 18 Verification Code", `Dear User, Your Verification Code is: ${verfCode}\nThanks,\nCOMP3335 - Group 18.`, `Dear User,<br><br>Your Verification Code is: <strong>${verfCode}</strong><br><br>Thanks,<br>COMP3335 - Group 18.`)
            if(sendResult.statusCode != 202){
                console.log("Send Result not 202: ", sendResult);
                console.log("Send again in 3sec.");
                setTimeout(() => Verf.send(email, "COMP3335 Group 18 Verification Code", `Dear User, Your Verification Code is: ${verfCode}\nThanks,\nCOMP3335 - Group 18.`, `Dear User,<br><br>Your Verification Code is: <strong>${verfCode}</strong><br><br>Thanks,<br>COMP3335 - Group 18.`), 3000);
            }
            return done(null, {
                email: email,
                password: password,
                id: insertResult.userID
            }, req.flash("registerMessage", `Verification Code have been sent to ${email}.Please enter the code in Profile Page.`));
        }
        
        return done(null, false, req.flash("registerMessage", "Error: Some Error occured, Try again later."))
    
    }catch(e){
        console.log(e)
        return done(null, false, req.flash("registerMessage", "Error: Some Error occured, Try again later."))
    }
    
})