module.exports = async (req, res) => {
//     [Object: null prototype] { id: '1', receiverEmail: '23@s' }
// BinaryRow {
//   id: 1,
//   email: 'kwiyin7@gmail.com',
//   password:
//    '$2b$10$60VhigSVoaiYQlASGik.NOrSFU1mrSz97Fv6QCNb9dWLaZpTnM8dW',
//   activated: 1,
//   activationCode: 'A80FY8',
//   address: null,
//   shastaKey: null,
//   registerationTime: 2019-04-19T21:56:32.000Z }
// console.log(req.body);
//         console.log(req.user);
//         res.status(200).json({
//             success: true
//         })
    if(!!!req.body.id || !!!req.body.receiverEmail){
        req.flash("failMessage", "File or Email Not Found.");
        res.redirect("/files")
    }
    // [Object: null prototype] { id: '4', receiverEmail: '23@s', onetime: '1' }
    // [Object: null prototype] { id: '4', receiverEmail: '23@s' }

    console.log(req.body);
}