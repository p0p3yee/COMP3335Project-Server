const client = require("ipfs-http-client");
const ipfs = client("ipfs.infura.io", 5001, {protocol: "https"});
const MAX_SIZE = 524288000;
const fs = require('mz/fs');

module.exports = async (req, res) => {
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
            error: `File needs to be smaller than ${MAX_SIZE} bytes.`,
        });
    }

    try {
        const files = await ipfs.add(fs.readFileSync(req.file.path), {
            progress: prog => console.log(`received: ${prog}`),
            chunker: "size-524288000"
        });

        await fs.unlink(req.file.path);
        console.log(files[0].hash);
        return res.json({
            hash: files[0].hash,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err,
        });
    }
}