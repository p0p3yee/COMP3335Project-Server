module.exports = {
    entry: {
        "./public/dropzone": `${__dirname}/public/dropzone.js`,
        "./public/user": `${__dirname}/public/user.js`,
    },
    output: {
        path: `${__dirname}/`,
        filename: "[name]-bundle.js"
    }
};