const Database = require("../../Database");

module.exports = async (req, res) => {
    const uploaded = await Database.getUserUploaded(req.user.id);
    res.render("files", {
        noupload: uploaded.length == 0,
        files: uploaded,
        user: req.user
    })
}