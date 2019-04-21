const crypto = require("crypto");
const bcrypt = require("bcrypt");

const hashType = "sha256";
const cipherType = "aes-256-ctr";

module.exports = {
    md5: txt => crypto.createHash("md5").update(txt).digest("hex"),
    sha256: text => crypto.createHash("sha256").update(text).digest("hex"),
    randHex: len => crypto.randomBytes(len).toString("hex"),
    bcryptCompare: (plain, hash) => bcrypt.compareSync(plain, hash),
    bcrypt: plain => bcrypt.hashSync(plain, bcrypt.genSaltSync(10)),
    /**
     * Input and output are ReadStream and WriteStream.
     */
    encryptFile: (secret, input, output) => new Promise(resolve => {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(cipherType, crypto.createHash(hashType).update(String(secret)).digest(), iv);
        input.pipe(cipher).pipe(output);
        output.on('finish', () => resolve(iv.toString("hex")));
    }),
    decryptFile: (iv, key, input, output) => new Promise(resolve => {
        input.pipe(crypto.createDecipheriv(cipherType, key, iv)).pipe(output);
        output.on('finish', resolve);
    }),
    getKeyBySecret: str => crypto.createHash(hashType).update(String(str)).digest()
    
}