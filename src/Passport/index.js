const Database = require("../Database");
const loginStrategy = require("./Login");
const registerStrategy = require("./Register");

module.exports = passport => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try{
            done(null, await Database.getUserByID(id));
        }catch(e){
            done(true, []);
        }
    });

    passport.use("login", loginStrategy);
    passport.use("register", registerStrategy);
}