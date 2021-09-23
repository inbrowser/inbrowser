const path = require('path');

module.exports = {
    mode: "development", //todo: production
    entry: {
        matrix: './matrix/api.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};