const Database = require("../../Database");

module.exports = async (req, res) => {
    const reqHash = req.params.hash;
    const Share = await Database.getShareByHash(reqHash);
    if(Share == null){
        req.flash("failMessage", "File Not Exsts.");
        res.redirect("/")
    }else{
        console.log(Share);
    }
}