const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    entry: {
        "index": "./src/pages/index/main.js",
        "login": "./src/pages/login/main.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name]-[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: ["babel-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin('dist'),
        // 全局引入jQuery
        new webpack.ProvidePlugin({
            $: "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        }),
        new HtmlWebpackPlugin({
            title: 'index',
            template: './src/pages/index/index.html',
            filename: 'index.html',
            hash: true,
            inject: 'body',
            chunks: ['vendors', 'index']
        }),
        new HtmlWebpackPlugin({
            title: 'login',
            template: './src/pages/login/index.html',
            filename: 'login.html',
            hash: true,
            inject: 'body',
            chunks: ['vendors', 'login']
        })
    ]
};