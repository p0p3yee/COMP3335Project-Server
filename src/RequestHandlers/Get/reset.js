const Database = require("../../Database");

module.exports = async (req, res) => {
    const hash = req.params.hash;

    const fPass = await Database.getForgotPasswordByHash(hash);
    if(fPass.length == 0){
        req.flash("failMessage", "Error: The Link is invalid.");
        return res.redirect("/")
    }

    if(!fPass[0].valid){
        req.flash("failMessage", "Error: The Link no longer available.");
        return res.redirect("/")
    }

    res.render("reset", {
        hash: hash,
        failMessage: req.flash("failMessage")
    })
}