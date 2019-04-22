const Database = require("../../Database");
const crypto = require("../../Encryption");

module.exports = async (req, res) => {

    const uploaded = await Database.getUserUploaded(req.user.id);
    const shared = await Database.getAllShareByToUserID(req.user.id);

    const uploadedFiles = []
    for(var i = 0; i < uploaded.length; i++){
        if(uploaded[i].deleted) continue;
        if(uploaded[i].link == null || !!!uploaded[i].link){
            var nowFileLink = crypto.sha256(`${uploaded[i].name.split("-enc")[0]}${crypto.randHex(16)}`);
            await Database.setLinkByFileID(uploaded[i].id, nowFileLink);
            uploaded[i].link = `${req.protocol}://${req.headers.host}/download/${nowFileLink}`;
        }else{
            uploaded[i].link = `${req.protocol}://${req.headers.host}/download/${uploaded[i].link}`;
        }
        uploadedFiles.push(uploaded[i]);
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
        noupload: uploadedFiles.length == 0,
        noshare: shared.length == 0,
        files: uploadedFiles,
        sharedFiles: sharedFiles,
        user: req.user,
        successMessage: req.flash("successMessage"),
        failMessage: req.flash("failMessage")
    })
}