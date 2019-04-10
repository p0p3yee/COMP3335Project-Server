module.exports = {
    entry: {
        "./src/Server/public/dropzone": `${__dirname}/src/Server/public/dropzone.js`
    },
    output: {
        path: `${__dirname}`,
        filename: "[name]-bundle.js"
    }
};