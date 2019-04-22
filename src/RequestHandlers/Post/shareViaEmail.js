const Database = require("../../Database");
const SendGrid = require("../../SendGrid");
const crypto = require("../../Encryption");

module.exports = async (req, res) => {
    if(req.user == null){
        req.flash("failMessage", "Please Login First.");
        return res.redirect("/login")
    }

    if(isNaN(req.user.id) || isNaN(req.body.id) || !!!req.body.receiverEmail){
        req.flash("failMessage", "File or Email Not Found.");
        return res.redirect("/files")
    }

    const user = await Database.getUserByID(req.user.id);

    if(user.password != req.user.password || user.email != req.user.email){
        req.flash("failMessage", "Invalid Credentials.");
        return res.redirect("/files");
    }

    if(user.email == req.body.receiverEmail){
        req.flash("failMessage", "You can't share the file to your own email.");
        return res.redirect("/files");
    }

    const file = await Database.getFileByFileID(req.body.id);

    if(file.ownerID != req.user.id){
        req.flash("failMessage", "Invalid Credentials.");
        return res.redirect("/files");
    }

    const hash = crypto.sha256(`${file.name.split("-enc")[0]}${crypto.randHex(32)}`);
    const isOneTime = req.body.onetime == null || req.body.onetime == "0" ? 0 : 1
    const alreadyShared = await Database.getShareByEmailVars(req.user.id, req.body.receiverEmail, req.body.id);
    if(alreadyShared.length > 0){
        req.flash("failMessage", "You already shared an access link of same file to same email.");
        return res.redirect("/files")
    }
    const result = await Database.createShareViaEmail(req.user.id, req.body.id, req.body.receiverEmail, hash, isOneTime);
    const aLink = `${req.protocol}://${req.headers.host}/share/${hash}`;
    if(result >= 1){
        const emailResult = await SendGrid.send(req.body.receiverEmail, 
        "G18Upload - A User shared a file to u !", 
        `Dear User,\nUser - ${user.email} shared a file to you. Here is the access link:\n\n${aLink}\n${isOneTime ? "This is an one-time link" : ""}\nThanks,\nCOMP3335 - Group 18.`,
        `Dear User,<br>User - ${user.email} shared a file to you. Here is the access link:<br><br><a href="${aLink}">${aLink}</a><br>${isOneTime ? "<strong>This is an one-time link</strong>" : ""}<br>Thanks,<br>COMP3335 - Group 18.`)
        
        if(emailResult.statusCode != 202){ //Failed.
            console.log("Send Result not 202: ", emailResult);
            console.log("Send again in 3sec.");
            setTimeout(() => SendGrid.send(req.body.receiverEmail, 
                "G18Upload - A User shared a file to u !", 
                `Dear User,\nUser - ${user.email} shared a file to you. Here is the access link:\n\n${aLink}\n${isOneTime ? "This is an one-time link" : ""}\nThanks,\nCOMP3335 - Group 18.`,
                `Dear User,<br>User - ${user.email} shared a file to you. Here is the access link:<br><br><a href="${aLink}">${aLink}</a><br>${isOneTime ? "<strong>This is an one-time link</strong>" : ""}<br>Thanks,<br>COMP3335 - Group 18.`
            ), 3 * 1000);
        }

        req.flash("successMessage", `${isOneTime ? "An One-Time Link" : "The Access Link"} of the file have sent to Email: ${req.body.receiverEmail}`)
        return res.redirect("/files");
    }else{
        req.flash("failMessage", "Error occured, Try again Later.");
        return res.redirect("/files");
    }
}