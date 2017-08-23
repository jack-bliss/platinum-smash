const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ContextReplacementPlugin } = require('webpack');

module.exports = {
    entry: {
        main: './src/main.ts'
    },
    output: {
        path: path.join(__dirname, "dist/"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: ['.js', '.ts', '.html', '.scss']
    },
    module: {
        loaders: [
            { test: /\.ts$/,                use: [ 'awesome-typescript-loader', 'angular2-template-loader' ] },
            { test: /\.html$/,              use: 'raw-loader' },
            { test: /\.scss$/,              use: [ 'raw-loader', 'sass-loader' ] },
            { test: /\.(png|jpg|svg)$/,     use: 'file-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            showErrors: true,
            title: "Webpack App",
            path: path.join(__dirname, "dist/"),
            hash: true
        }),
        new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, 'src')
        )
    ]
}
