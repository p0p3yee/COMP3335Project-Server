const Database = require("../../Database");
const encryption = require("../../Encryption");
const fs = require("mz/fs");
const path = require("path");

module.exports = async (req, res) => {
    const reqHash = req.params.hash;
    const Share = await Database.getShareByHash(reqHash);

    if(Share == null){
        req.flash("failMessage", "File Not Exsts.");
        return res.redirect("/")
    }

    if(!Share.valid){
        req.flash("failMessage", "The Access Link is no longer valid.");
        return res.redirect("/")
    }

    const File = await Database.getFileByFileID(Share.fileID);
    if(File == null){
        req.flash("failMessage", "File Not Exsts.");
        return res.redirect("/")
    }

    const Owner = await Database.getUserByID(File.ownerID);

    const outPath = path.resolve(`${__dirname}/../../../uploads/Decrypted/${File.link}${File.extension}`);
    const inPath = path.resolve(`${__dirname}/../../../uploads/${File.name}`);
    const secret = `${Owner.password}@${File.createTime}`;
    const iv = Buffer.from(File.iv.toString("hex"), "hex");

    try{
        if(await fs.exists(outPath)){
            if(Share.onetime) await Database.setShareValid(Share.id, 0);
            return res.sendFile(outPath);
        }
        if(!await fs.exists(inPath)) {
            throw new Error();
        }
        const sha256edSecret = encryption.sha256(secret);
        await encryption.decryptFile(iv, encryption.getKeyBySecret(sha256edSecret), fs.createReadStream(inPath), fs.createWriteStream(outPath));
        if(Share.onetime) await Database.setShareValid(Share.id, 0);
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