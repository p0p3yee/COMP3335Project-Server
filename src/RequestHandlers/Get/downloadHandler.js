const Database = require("../../Database");
const encryption = require("../../Encryption");
const fs = require("mz/fs");
const path = require("path");

async function returnFile(req, res, inPath, outPath, secret, iv){
    try{
        if(await fs.exists(outPath)){
            return res.sendFile(outPath);
        }
        if(!await fs.exists(inPath)) {
            throw new Error();
        }
        const sha256edSecret = encryption.sha256(secret);
        await encryption.decryptFile(iv, encryption.getKeyBySecret(sha256edSecret), fs.createReadStream(inPath), fs.createWriteStream(outPath));
        setTimeout(async () => {
            try{
                const link = outPath;
                await fs.unlink(link);
            }catch(e){}
        }, 1000 * 60 * 15);
        return res.sendFile(outPath);
    }catch(e){
        console.log(e);
        req.flash("failMessage", "File Deleted.");
        return res.redirect("/")
    }   
}

module.exports = async (req, res) => {
    const reqLink = req.params.link;
    
    const File = await Database.getFileByLink(reqLink);

    if(File == null){
        req.flash("failMessage", "File Not Exsts.");
        return res.redirect("/")
    }

    const outPath = path.resolve(`${__dirname}/../../../uploads/Decrypted/${reqLink}${File.extension}`);
    const inPath = path.resolve(`${__dirname}/../../../uploads/${File.name}`);

    const iv = Buffer.from(File.iv.toString("hex"), "hex");

    if(File.public == 0 && req.user == null){
        req.flash("failMessage", "You are not allowed to access the file.");
        return res.redirect("/")
    }
    
    try{
        const Owner = await Database.getUserByID(File.ownerID);

        if(File.public == 1){
            return returnFile(req, res, inPath, outPath, `${Owner.password}@${File.createTime}`, iv);
        }
        //Not a public file
    
        if(req.user == null){
            req.flash("failMessage", "You are not allowed to access the file.");
            return res.redirect("/")
        }
        //If is owner
        if(req.user.id == File.ownerID && req.user.password == Owner.password){
            return returnFile(req, res, inPath, outPath, `${Owner.password}@${File.createTime}`, iv);
        }
        //Not Owner, See if the user r shared
        const Share = await Database.getShareByFileID(File.id);
        if(Share.length == 0 && File.ownerID != req.user.id){
            req.flash("failMessage", "You are not allowed to access the file.");
            return res.redirect("/")
        }
    
        for(var i = 0; i < Share.length; i ++){
            if(Share[i].toUserID == req.user.id && Share[i].valid){
                return returnFile(req, res, inPath, outPath, `${Owner.password}@${File.createTime}`, iv);
            }
        }
    
        req.flash("failMessage", "You are not allowed to access the file.");
        return res.redirect("/")
    }catch(e){
        console.error(e);
        req.flash("failMessage", "Error: An Error Occured.");
        return res.redirect("/")
    }
}