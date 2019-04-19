const Database = require("../Database");
const crypto = require("../Encryption");
module.exports = async (req, res) => {
    console.log(req.body);

    if(isNaN(req.body.id)){
        req.flash("profileMessage", "Error: User ID invalid.");
        res.redirect("/profile");
    }
    try{
        const user = await Database.getUserByID(req.body.id);
        if(user.activated && req.activated == "False"){
            req.flash("profileMessage", "Error: User already activated");
            res.redirect("/profile");
        }
        if(user.email != req.body.email){
            req.flash("profileMessage", "Error: Incorrect Email.");
            res.redirect("/profile");
        }
        
        if(!crypto.bcryptCompare(req.body.password, user.password)){
            req.flash("profileMessage", "Error: Incorrect Password");
            res.redirect("/profile");
        }
        if(req.body.activated == "False" && !user.activated && req.body.activationCode != user.activationCode){
            req.flash("profileMessage", "Error: Incorrect Activation Code.");
            res.redirect("/profile");
        }
        if(req.activated == "True" && user.activated){ //Update Data

        }else if(req.activated == "False" && !user.activated && req.activationCode == user.activationCode){
            //Activation code correct.

        }else{
            req.flash("profileMessage", "Error: An Error Occured. Try again later.");
            res.redirect("/profile");
        }
    }catch(e){
        req.flash("profileMessage", "Error: An Error Occured. Try again later.");
        res.redirect("/profile");
    }
}   
