const Database = require("../../Database");
const crypto = require("../../Encryption");
module.exports = async (req, res) => {
    if(isNaN(req.body.id)){
        req.flash("profileMessage", "Error: User ID invalid.");
        return res.redirect("/profile");
    }
    try{
        const user = await Database.getUserByID(req.body.id);
        if(user.activated && req.activated == "False"){
            req.flash("profileMessage", "Error: User already activated");
            return res.redirect("/profile");
        }
        if(user.email != req.body.email){
            req.flash("profileMessage", "Error: Incorrect Email.");
            return res.redirect("/profile");
        }
        
        if(!crypto.bcryptCompare(req.body.password, user.password)){
            req.flash("profileMessage", "Error: Incorrect Password");
            return res.redirect("/profile");
        }
        if(req.body.activated == "False" && !user.activated && req.body.activationCode != user.activationCode){
            req.flash("profileMessage", "Error: Incorrect Activation Code.");
            return res.redirect("/profile");
        }

        if(req.body.activated == "True" && user.activated){ //Update Data
            const updated = await Database.updateUserPasswordByID(crypto.bcrypt(req.body.newpassword), req.body.id);
            if(updated >= 1){
                req.flash("registerMessage", "Password Updated.");
                req.logout();
                res.redirect("/profile");
            }else{
                req.flash("profileMessage", "Error: Update Password Failed. Try again later.");
                res.redirect("/profile");
            }
        }else if(req.body.activated == "False" && !user.activated && req.body.activationCode == user.activationCode){
            //Activation code correct.
            const affectedRows = await Database.activateUserByID(req.body.id);
            if(affectedRows >= 1){
                req.flash("registerMessage", "Account Activated.");
                res.redirect("/profile");
            }else{
                req.flash("profileMessage", "Error: Activation Failed. Try again later.");
                res.redirect("/profile");
            }
        }else{
            req.flash("profileMessage", "Error: An Error Occured. Try again later.");
            res.redirect("/profile");
        }
    }catch(e){
        req.flash("profileMessage", "Error: An Error Occured. Try again later.");
        res.redirect("/profile");
    }
}   
