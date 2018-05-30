const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
        rules: [{
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        // attrs: [':data-src']
                    }
                }
            },
            {
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "less-loader"],
                    publicPath: '../'
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: ["babel-loader"]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name]-[hash].[ext]',
                        outputPath: 'imgs/',
                    }
                }]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
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
        new ExtractTextPlugin('css/[name].[hash].css'),
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