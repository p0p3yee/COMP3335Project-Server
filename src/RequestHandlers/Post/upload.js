const client = require("ipfs-http-client");
const fs = require('mz/fs');
const path = require("path");
const crypto = require("../../Encryption");
const Database = require("../../Database");

const ipfs = client("ipfs.infura.io", 5001, {protocol: "https"});
const MAX_SIZE = 52428800;

const algo = "aes-256-ctr"

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

    //Encrypt the file with algo "aes-256-ctr";

    console.log("Path: ", req.file.path);
    const saveAs = `${req.file.path}-enc`;

    try{
        const now = parseInt(Date.now() / 1000);
        const iv = await crypto.encryptFile(crypto.md5(`${req.user.password}@${now}`), fs.createReadStream(req.file.path), fs.createWriteStream(saveAs));
        await fs.unlink(req.file.path);
        const dbResult = await Database.addFile(req.user.id, iv, now, req.file.mimetype);
        
        const files = await ipfs.add(fs.readFileSync(saveAs), {
            progress: prog => console.log(`received: ${prog}`)
        });

        await fs.unlink(saveAs);
        await Database.uploadedFile(dbResult.id, files[0].hash, parseInt(Date.now() / 1000));
        console.log(files[0].hash);
        return res.json({
            hash: files[0].hash,
            name: req.file.originalname
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({
            error: e,
        });
    }
}