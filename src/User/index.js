const mysql = require("mysql2/promise")
// class User{
//     constructor(){
        
//     }

//     execute(query, args){
//         return this.conn == null ? new Error("No Database Connection") : args == null ? this.conn.execute(query) : this.conn.execute(query, args);
//     }
// }
// mysql.createConnection({
//     host: process.env.mysqlHost,
//     user: process.env.mysqlUser,
//     database: process.env.env.mysqlDatabase
// }).then(connection => {
//     this.conn = connection;
//     console.log(this.conn);
// })

// module.exports = User

mysql.createConnection({
    host: process.env.mysqlHost,
    user: process.env.mysqlUser,
    database: process.env.env.mysqlDatabase,
    pass: process.env.mysqlPass
}).then(conn => {

})

new Promise(resolve => setTimeout(resolve, 2000)).then(() => {
    this.a = 123;
    
    this.omg = function xdd() {
        console.log("xd")
    }
}).catch(e => {
    this.error = e;
    console.log(e);
})

// try{
//     const conn = await mysql.createConnection({
//         host: "",
//         user: "",
//         database: ""
//     });

//     const result = await conn.execute(
//         `Select * From Users Where email = ? and password = ?`, 
//         [email, password]
//     )
//     console.log(result);
//     done(null, null, null);
// }catch(e){
//     return done(null, false, {
//         message: `Failed to connect to database.`
//     })
// }