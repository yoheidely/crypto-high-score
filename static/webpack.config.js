const webpack = require('webpack');

const config = {
    entry:  __dirname + '/js/index.jsx',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: 'babel-loader'

            },
            {
                test: /\.scss?$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css?$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       })
    ]
};
module.exports = config;
