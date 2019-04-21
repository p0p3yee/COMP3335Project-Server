const Database = require("../../Database");

module.exports = async (req, res) => {
  
    const keys = Object.keys(req.body);

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
        var hvNotExistsUser = [];
        for(var i = 0; i < keys.length - 1; i++){
            if(keys[i] == "fileid") continue;
            if(!keys[i].includes("userid")) continue;
            var nowID = req.body[keys[i]];
            if(isNaN(nowID)) continue;
            if(nowID == req.body.id) continue;
            var nowUser = await Database.getUserByID(nowID);
            if(nowUser == null) {
                hvNotExistsUser.push(nowID);
                continue;
            }
            var alreadyShared = await Database.getShareByVars(req.user.id, nowID, req.body.fileid);
            if(alreadyShared.length == 0) await Database.createShareToUser(req.user.id, req.body.fileid, nowID);
        }
        
        req.flash("successMessage", "File Sharing Setting Updated.");
        if(hvNotExistsUser.length > 0){
            req.flash("failMessage", "These User do not exists: " + hvNotExistsUser.join(", "));
        }
        return res.redirect("/files");
    }catch(e){
        console.log(e);
        req.flash("failMessage", "Failed to update setting. Try again later.");
        return res.redirect("/files");
    }
}