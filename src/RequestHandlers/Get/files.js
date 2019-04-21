const Database = require("../../Database");

module.exports = async (req, res) => {
    const uploaded = await Database.getUserUploaded(req.user.id);
    const shared = await Database.getAllShareByToUserID(req.user.id);

    var allDeled = true;
    for(var i = 0; i < uploaded.length; i++){
        if(uploaded[i].deleted == 0){
            allDeled = false;
            break;
        }
    }

    const sharedFiles = [];
    for(var i = 0; i < shared.length; i++){
        if(!shared[i].valid) continue;
        var nowFile = await Database.getFileByFileID(shared[i].fileID);
        if(nowFile.deleted) continue;
        if(!!!nowFile.link) continue;
        nowFile.shareAccessLink = `${req.protocol}://${req.headers.host}/download/${nowFile.link}`;
        sharedFiles.push(nowFile);
    }

    res.render("files", {
        noupload: uploaded.length == 0 || allDeled,
        noshare: shared.length == 0,
        files: uploaded,
        sharedFiles: sharedFiles,
        user: req.user,
        successMessage: req.flash("successMessage"),
        failMessage: req.flash("failMessage")
    })
}