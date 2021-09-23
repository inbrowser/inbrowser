const path = require('path');

module.exports = {
    mode: "production", //todo: production
    entry: {
        seo: './seo/api.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};