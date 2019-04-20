const Database = require("../../Database");

module.exports = async (req, res) => {
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

    const result = await Database.setFilePublicByID(req.body.fileid, req.body.public == "0" ? 0 : 1);
   
    if(result >= 1){
        req.flash("successMessage", "File Sharing Setting Updated.");
        return res.redirect("/files");
    }else{
        req.flash("failMessage", "Failed to update setting. Try again later.");
        return res.redirect("/files");
    }
}