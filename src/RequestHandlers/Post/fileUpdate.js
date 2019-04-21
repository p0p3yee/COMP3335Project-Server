const Database = require("../../Database");

module.exports = async (req, res) => {

    if(req.user == null){
        req.flash("failMessage", "Please Login First.");
        return res.redirect("/login")
    }

    if(isNaN(req.user.id) || isNaN(req.body.fileid)){
        req.flash("failMessage", "Incorrect Parameters.");
        return res.redirect("/files")
    }

    const user = await Database.getUserByID(req.user.id);

    if(user.password != req.user.password || user.email != req.user.email){
        req.flash("failMessage", "Invalid Credentials.");
        return res.redirect("/files");
    }

    const file = await Database.getFileByFileID(req.body.fileid);
    if(file.ownerID != req.user.id){
        req.flash("failMessage", "Invalid Credentials.");
        return res.redirect("/files");
    }

    try{
        if(req.body.public != null){
            await Database.setFilePublicByID(req.body.fileid, req.body.public == "0" ? 0 : 1);
        }

        if(req.body.userid == ""){
            req.flash("successMessage", `File Sharing Setting Updated.`);
            return res.redirect("/files");
        }

        if(isNaN(req.body.userid)){
            req.flash("failMessage", "Error: Incorrect User ID.");
            return res.redirect("/files");
        }

        if(req.body.userid == req.user.id){
            req.flash("failMessage", "Error: You can't share the file to yourself.");
            return res.redirect("/files");
        }

        const nowUser = await Database.getUserByID(req.body.userid);
        if(nowUser == null) {
            req.flash("failMessage", `Error: User ID: ${req.body.userid}, do not Exists.`);
            return res.redirect("/files");
        }

        const alreadyShared = await Database.getShareByVars(req.user.id, req.body.userid, req.body.fileid);
        if(alreadyShared.length != 0) {
            req.flash("failMessage", `Error: File already shared to User ID: ${req.body.userid} .`);
            return res.redirect("/files");
        }
        
        const result = await Database.createShareToUser(req.user.id, req.body.fileid, req.body.userid);
        
        req.flash("successMessage", `File Sharing Setting Updated. ${result > 0 ? "File Shared to User ID: " + req.body.userid : ""}`);
        return res.redirect("/files");
    }catch(e){
        console.log(e);
        req.flash("failMessage", "Failed to update setting. Try again later.");
        return res.redirect("/files");
    }
}