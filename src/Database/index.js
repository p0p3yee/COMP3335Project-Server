require("dotenv").config();
const mysql = require("mysql2/promise");

const Setting = {
    USER: process.env.MYSQLUSER,
    PASS: process.env.MYSQLPASS,
    DB: process.env.MYSQLDB,
    HOST: process.env.MYSQLHOST
};

new Promise(async (resolve, reject) => {
    try{
        return resolve(await mysql.createConnection({
            host: Setting.HOST,
            user: Setting.USER,
            database: Setting.DB,
            password: Setting.PASS
        }))
    }catch(e){
        return reject(e);
    }
})
.then(conn => {
    this.inited = true;

    this.insertNewUser = (email, password, code) => new Promise((resolve, reject) => conn.execute(`INSERT INTO User (email, password, activationCode) VALUES (?, ?, ?)`, [email, password, code])
    .then(r => resolve({
        affectedRows: r[0].affectedRows,
        userID: r[0].insertId 
    }))
    .catch(e => reject(e)));

    this.emailExists = email => new Promise((resolve, reject) => conn.execute(`Select * From User Where email = ?`, [email])
    .then(v => resolve(v[0].length > 0))
    .catch(e => reject(e)));

    this.getUserByID = id => new Promise((resolve, reject) => conn.execute(`Select * From User Where id = ?`, [id])
    .then(v => resolve(v[0][0]))
    .catch(e => reject(e)));

    this.getUserByEmail = email =>new Promise((resolve, reject) => conn.execute(`Select * From User Where email = ?`, [email])
    .then(v => resolve(v[0][0]))
    .catch(e => reject(e)));

    this.activateUserByID = id => new Promise((resolve, reject) => conn.execute(`UPDATE User SET activated = 1 Where id = ?`, [id])
    .then(v => resolve(v[0].affectedRows))
    .catch(e => reject(e)));

    this.updateUserPasswordByID = (password, id) => new Promise((resolve, reject) => conn.execute(`UPDATE User SET password = ? Where id = ?`, [password, id])
    .then(v => resolve(v[0].affectedRows))
    .catch(e => reject(e)));

    this.uploadFile = (id, iv, time, mimeType, name, ext, orgname) => new Promise((resolve, reject) => conn.execute(`INSERT INTO File (ownerID, iv, createTime, mimeType, name, extension, orgName) VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, iv, String(time), mimeType, name, ext, orgname])
    .then(r => resolve({
        affectedRows: r[0].affectedRows,
        id: r[0].insertId 
    }))
    .catch(e => reject(e)));

    this.getUserUploaded = id => new Promise((resolve, reject) => conn.execute(`SELECT id, orgName, extension, createTime, deleted, public, link From File Where ownerID = ?`, [id])
    .then(v => {
        for(var i = 0; i < v[0].length; i++){
            v[0][i].createTime = new Date(parseInt(v[0][i].createTime)).toLocaleString();
        }
        return resolve(v[0]);
    })
    .catch(e => reject(e)));

    this.deleteFile = fileid => new Promise((resolve, reject) => conn.execute(`UPDATE File SET deleted = 1 WHERE id = ?`, [fileid])
    .then(r => resolve(r[0].affectedRows))
    .catch(e => reject(e)));

    this.getFileByFileID = fileid => new Promise((resolve, reject) => conn.execute(`SELECT * FROM File WHERE id = ?`, [fileid])
    .then(v => resolve(v[0][0]))
    .catch(e => reject(e)));

    this.setFilePublicByID = (fileid, public) => new Promise((resolve, reject) => conn.execute(`UPDATE File SET public = ? WHERE id = ?`, [public, fileid])
    .then(r => resolve(r[0].affectedRows))
    .catch(e => reject(e)));

    this.getShareByID = id => new Promise((resolve, reject) => conn.execute(`SELECT * FROM Share WHERE id = ?`, [id])
    .then(v => resolve(v[0][0]))
    .catch(e => reject(e)));

    this.getShareByFileID = id => new Promise((resolve, reject) => conn.execute(`SELECT * FROM Share WHERE fileID = ?`, [id])
    .then(v => resolve(v[0]))
    .catch(e => reject(e)));

    this.getAllShareByOwnerID = id => new Promise((resolve, reject) => conn.execute(`SELECT * FROM Share WHERE ownerID = ?`, [id])
    .then(v => resolve(v[0]))
    .catch(e => reject(e)));

    this.getAllShareByToUserID = id => new Promise((resolve, reject) => conn.execute(`SELECT * FROM Share WHERE toUserID = ?`, [id])
    .then(v => resolve(v[0]))
    .catch(e => reject(e)));

    this.getShareByHash = hash => new Promise((resolve, reject) => conn.execute(`SELECT * FROM Share WHERE hash = ?`, [hash])
    .then(v => resolve(v[0][0]))
    .catch(e => reject(e)));

    this.getShareByVars = (ownerID, toUserID, fileID) => new Promise((resolve, reject) => conn.execute(`SELECT * FROM Share WHERE ownerID = ? and fileID = ? and toUserID = ?`, [ownerID, fileID, toUserID])
    .then(v => resolve(v[0]))
    .catch(e => reject(e)));

    this.getShareByEmailVars = (ownerID, email, fileID) => new Promise((resolve, reject) => conn.execute(`SELECT * FROM Share WHERE ownerID = ? and fileID = ? and email = ? and onetime = 0`, [ownerID, fileID, email])
    .then(v => resolve(v[0]))
    .catch(e => reject(e)));

    this.setLinkByFileID = (id, link) => new Promise((resolve, reject) => conn.execute(`UPDATE File SET link = ? WHERE id = ?`, [link, id])
    .then(v => resolve(v[0].affectedRows))
    .catch(e => reject(e)));

    this.getFileByLink = link => new Promise((resolve, reject) => conn.execute(`SELECT * FROM File WHERE link = ?`, [link])
    .then(v => resolve(v[0][0]))
    .catch(e => reject(e)));

    this.createShareToUser = (ownerID, fileID, toUserID) => new Promise((resolve, reject) => conn.execute(`INSERT INTO Share(ownerID, fileID, toUserID) VALUES (?, ?, ?)`, [ownerID, fileID, toUserID])
    .then(r => resolve(r[0].affectedRows))
    .catch(e => reject(e)));

    this.createShareViaEmail = (ownerID, fileID, email, hash, onetime) => new Promise((resolve, reject) => conn.execute(`INSERT INTO Share(ownerID, fileID, email, hash, onetime) VALUES (?, ?, ?, ?, ?)`, [ownerID, fileID, email, hash, onetime])
    .then(r => resolve(r[0].affectedRows))
    .catch(e => reject(e)));

    this.flipShareValid = shareID => new Promise((resolve, reject) => conn.execute(`UPDATE Share SET valid = NOT valid WHERE id = ?`, [shareID])
    .then(v => resolve(v[0].affectedRows))
    .catch(e => reject(e)));
})
.catch(e => {
    this.error = e;
})