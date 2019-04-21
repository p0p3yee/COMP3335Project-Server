const Database = require("../../Database");
const crypto = require("../../Encryption");

module.exports = async (req, res) => {
    if(isNaN(req.user.id) || isNaN(req.body.id)){
        return res.json({
            error: "Incorrect Parameters."
        });
    }

    const user = await Database.getUserByID(req.user.id);

    if(user.password != req.user.password || user.email != req.user.email){
        return res.json({
            error: "Invalid Credentials."
        });
    }

    const file = await Database.getFileByFileID(req.body.id);

    if(file.ownerID != req.user.id){
        return res.json({
            error: "Invalid Credentials."
        });
    }

    if(file.link == null || !!!file.link){
        
        const fileLink = crypto.sha256(`${file.name.split("-enc")[0]}${crypto.randHex(16)}`);
        const r = await Database.setLinkByFileID(req.body.id, fileLink);
        if(r >= 1){
            return res.json({
                result: fileLink
            })
        }else{
            return res.json({
                error: "Error"
            })
        }
    }else{
        return res.json({
            result: file.link
        })
    }
}