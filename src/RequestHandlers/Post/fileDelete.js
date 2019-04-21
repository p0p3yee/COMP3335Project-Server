const Database = require("../../Database");
const fs = require('mz/fs');

module.exports = async (req, res) => {

    if(isNaN(req.user.id) || isNaN(req.body.id)){
        req.flash("failMessage", "Incorrect Parameters.");
        return res.redirect("/files")
    }

    const user = await Database.getUserByID(req.user.id);

    if(user.password != req.user.password || user.email != req.user.email){
        req.flash("failMessage", "Invalid Credentials.");
        return res.redirect("/files");
    }

    const file = await Database.getFileByFileID(req.body.id);
    if(file.ownerID != req.user.id){
        req.flash("failMessage", "Invalid Credentials.");
        return res.redirect("/files");
    }

    const result = await Database.deleteFile(req.body.id)

    if(result >= 1){
        try{
            await fs.unlink(`${__dirname}/../../../uploads/${file.name}`)
        }catch(e){}
        req.flash("successMessage", "File Deleted.");
        return res.redirect("/files");
    }else{
        req.flash("failMessage", "Failed to delete. Try again later.");
        return res.redirect("/files");
    }
}