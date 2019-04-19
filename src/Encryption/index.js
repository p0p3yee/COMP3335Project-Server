const crypto = require("crypto");
const bcrypt = require("bcrypt");

module.exports = {
    md5: txt => crypto.createHash("md5").update(txt).digest("hex"),
    bcryptCompare: (plain, hash) => bcrypt.compareSync(plain, hash)
}