const fs = require('mz/fs');
const path = require("path");
const crypto = require("../../Encryption");
const Database = require("../../Database");

const MAX_SIZE = 104857600;

module.exports = async (req, res) => {
    if(req.user == null){
        return res.status(500).json({
            error: 'Please login first.',
        });
    }

    if(req.user.activated == null){
        return res.status(500).json({
            error: 'Please activate your account first.',
        });
    }

    if(req.user.email == null){
        return res.status(500).json({
            error: 'Please login first.',
        });
    }

    const user = await Database.getUserByEmail(req.user.email);

    if(user == null || user == []){
        return res.status(500).json({
            error: 'Please login first.',
        });
    }

    if(user.password != req.user.password){
        return res.status(500).json({
            error: 'Incorrect Password.',
        });
    }

    if (!req.file) {
        return res.status(500).json({
            error: 'File needs to be provided.',
        });
    }

    const fileSize = req.file.size;
    if (fileSize > MAX_SIZE) {
        try {
            await fs.unlink(req.file.path);
        } catch (e) {
            return res.status(500).json({
                error: err,
            });
        }

        return res.status(500).json({
            error: `File needs to be smaller than ${MAX_SIZE / 1024 / 1024} MB.`,
        });
    }

    if(req.file.originalname.length >= 250){
        return res.status(500).json({
            error: "File Name too Long."
        })
    }

    const saveAs = `${req.file.path}-enc`;

    try{
        const now = Date.now();
        const iv = await crypto.encryptFile(crypto.sha256(`${req.user.password}@${now}`), fs.createReadStream(req.file.path), fs.createWriteStream(saveAs));
        await fs.unlink(req.file.path);
        const dbResult = await Database.uploadFile(req.user.id, iv, now, req.file.mimetype, path.basename(saveAs), path.extname(req.file.originalname), req.file.originalname);
        if(dbResult.affectedRows >= 1){
            return res.json({
                id: dbResult.id,
                name: req.file.originalname
            });
        }else throw new Error("File did not uploaded to database.")
    }catch(e){
        console.log(e);
        return res.status(500).json({
            error: e,
        });
    }
}