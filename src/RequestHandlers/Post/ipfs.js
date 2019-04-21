const fs = require('mz/fs');
const client = require("ipfs-http-client");

const ipfs = client("ipfs.infura.io", 5001, {protocol: "https"});

const MAX_SIZE = 52428800;

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
            error: `File needs to be smaller than ${MAX_SIZE / 1024 / 1024} MB.`,
        });
    }

    try {
        const files = await ipfs.add(fs.readFileSync(req.file.path));

        await fs.unlink(req.file.path);
        return res.json({
            url: `https://ipfs.io/ipfs/${files[0].hash}`,
            hash: files[0].hash
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err,
        });
    }
}