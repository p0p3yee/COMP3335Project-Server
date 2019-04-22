const Database = require("../../Database");
const encryption = require("../../Encryption");

module.exports = async (req, res) => {
    if(!!!req.body.hash){
        req.flash("failMessage", "Error: Invalid Parameters.")
        return res.redirect("/");
    }

    if(!encryption.bcryptCompare(req.body.confPassword, req.body.password)){
        req.flash("failMessage", "Error: Two Password not the same.")
        return res.redirect(req.headers.referer);
    }

    try{
        const fp = await Database.getForgotPasswordByHash(req.body.hash);

        if(fp.length == 0){
            req.flash("failMessage", "Error: Invalid Parameters.")
            return res.redirect("/");
        }
    
        if(!fp[0].valid){
            req.flash("failMessage", "Error: The Link no longer available.");
            return res.redirect("/")
        }

        const result = await Database.updateUserPasswordByID(req.body.password, fp[0].userID);
        if(result > 0){
            await Database.setForgotPasswordNotValidByID(fp[0].id);
            req.flash("registerMessage", "Password Updated !")
            return res.redirect("/login");
        }
        
        req.flash("failMessage", "Error: An Error Occured, Try again Later.")
        return res.redirect(req.headers.referer);

    }catch(e){
        req.flash("failMessage", "Error: An Error Occured, Try again Later.");
        return res.redirect("/")
    }
    


}