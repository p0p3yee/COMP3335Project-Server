const Database = require("../../Database");

module.exports = async (req, res) => {
    const uploaded = await Database.getUserUploaded(req.user.id);
    const shared = await Database.getAllShareByToUserID(req.user.id);

    var allDeled = true;
    for(var i = 0; i < uploaded.length; i ++){
        if(uploaded[i].deleted == 0){
            allDeled = false;
            break;
        }
    }
    res.render("files", {
        noupload: uploaded.length == 0 || allDeled,
        noshare: shared.length == 0,
        files: uploaded,
        user: req.user,
        successMessage: req.flash("successMessage"),
        failMessage: req.flash("failMessage")
    })
}