const localStrategy = require("passport-local").Strategy;
const mysql = require("mysql2/promise");

module.exports = new localStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {
    console.log(email);
    console.log(password)
    if(email == null){
        return done(null, false, {
            message: `Invalid Email.`
        })
    }

    if(password == null){
        return done(null, false, {
            message: `Invalid Password.`
        })
    }

    try{
        const conn = await mysql.createConnection({
            host: "",
            user: "",
            database: ""
        });

        const result = await conn.execute(
            `Select * From Users Where email = ? and password = ?`, 
            [email, password]
        )
        console.log(result);
        done(null, null, null);
    }catch(e){
        return done(null, false, {
            message: `Failed to connect to database.`
        })
    }
    
})