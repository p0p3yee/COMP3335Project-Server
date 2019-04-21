const Database = require("../../Database");

module.exports = async(req, res) => {
    const shared = await Database.getAllShareByOwnerID(req.user.id);
    const sharedFiles = [];

    for(var i = 0; i < shared.length; i++){
        var currentFile = await Database.getFileByFileID(shared[i].fileID);
        if(currentFile.deleted) continue;
        sharedFiles.push({
            shareID: shared[i].id,
            toUserID: shared[i].toUserID,
            toEmail: shared[i].email,
            shareTime: new Date(shared[i].shareTime).toLocaleString(),
            oneTime: shared[i].onetime,
            valid: shared[i].valid,
            fileName: currentFile.orgName
        })
    }


    res.render("share", {
        user: req.user,
        noShare: sharedFiles.length == 0,
        shared: sharedFiles
    })
}