const path = require('path');

module.exports = {
    mode: "production", //todo: production or development
    entry: {
        matrix: './matrix/api.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'inbrowser',
        libraryTarget: 'window'
    },
};