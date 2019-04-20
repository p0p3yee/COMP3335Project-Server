module.exports = async (req, res) => {
    res.render("files", {
        user: req.user
    })
}