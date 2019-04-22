const Database = require("../../Database");
const SendGrid = require("../../SendGrid");
const encryption = require("../../Encryption");

module.exports = async (req, res) => {
    if(!!!req.body.email){
        req.flash("failMessage", "Error: User Not Found.");
        return res.redirect("/")
    }

    const User = await Database.getUserByEmail(req.body.email);
    if(User == null){
        req.flash("failMessage", "Error: User Not Found.");
        return res.redirect("/")
    }

    try{
        const hash = encryption.sha256(`${req.body.email}@${Date.now()}@${encryption.randHex(8)}`);

        const beforeFp = await Database.getForgotPasswordByUserID(User.id);
        for(var i = 0; i < beforeFp.length; i++){
            if(beforeFp[i].valid){
                await Database.setForgotPasswordNotValidByID(beforeFp[i].id);
            }
        }

        const insertResult = await Database.insertForgotPassword(User.id, hash);
        if(insertResult.affectedRows <= 0){
            req.flash("failMessage", "Error: An Error occured. Try again later.");
            return res.redirect("/");
        }
        const link = `${req.protocol}://${req.headers.host}/reset/${hash}`;
        const sendResult = await SendGrid.send(User.email, 
            `G18Upload - Password RESET`,
            `Dear User,\nClick the following Link to RESET your password:\n\n${link}\n\nThanks,\nCOMP3335 - Group 18.`,
            `Click the following Link to <strong>RESET</strong> your password:<br><br><a href = "${link}">${link}</a><br><br>Thanks,<br>COMP3335 - Group 18.`
            )
        if(sendResult.statusCode != 202){ //Failed.
            console.log("Send Result not 202: ", emailResult);
            console.log("Send again in 3sec.");
            setTimeout(() => SendGrid.send(User.email, 
                `G18Upload - Password RESET`,
                `Dear User,\nClick the following Link to RESET your password:\n\n${link}\n\nThanks,\nCOMP3335 - Group 18.`,
                `Dear User,<br>Click the following Link to <strong>RESET</strong> your password:<br><br><a href = "${link}">${link}</a><br><br>Thanks,<br>COMP3335 - Group 18.`
            ), 3 * 1000);
        }
        setTimeout(() => {
            try{
                const theID = insertResult.id;
                Database.setForgotPasswordNotValidByID(theID);
            }catch(e){
                console.error(e);
            }
        }, 1000 * 60 * 15);
        req.flash("successMessage", `Password RESET Link have been sent to: ${User.email} . Link will be valid for 15mins`);
        return res.redirect("/")
    }catch(e){
        console.error(e);
        req.flash("failMessage", "Error: An Error Occured.");
        return res.redirect("/")
    }

}