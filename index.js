const client = require("ipfs-http-client");
const express = require("express");
const multer = require('multer');
const passport = require("passport");
const strategy = require("./src/Auth")
const bodyParser = require("body-parser");
const fs = require('mz/fs');

const ipfs = client("ipfs.infura.io", 5001, {protocol: "https"});
const app = express();
const upload = multer({dest: `${__dirname}/uploads`});
const MAX_SIZE = 524288000;

passport.use("local", strategy);

app.set('view engine', 'pug');
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.get('/', (req, res) => res.render('index'));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

app.post(`/upload`, upload.single("file"), async (req, res) => {
    console.log(req.file)
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
});

app.post(`/login`, passport.authenticate("local", {session: false}),(req, res) => {

})

app.listen(8080, () => console.log("Listening on port 8080."))