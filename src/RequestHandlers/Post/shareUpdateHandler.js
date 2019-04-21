const Database = require("../../Database");

module.exports = async (req, res) => {
    if(isNaN(req.body.id)){
        return res.json({
            error: "Error: Invalid Parameters."
        })
    }

    const Share = await Database.getShareByID(req.body.id);
    if(Share.ownerID != req.user.id){
        return res.json({
            error: "Error: Invalid Credentials."
        })
    }

    const result = await Database.flipShareValid(req.body.id);
    if(result > 0){
        return res.json({
            success: true
        })
    }

    return res.json({
        error: "Error: An Error Occured. Try again later."
    })
}