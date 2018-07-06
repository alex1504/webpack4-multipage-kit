const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractThemePlugin = require("./webpackPlugins/extract-theme-plugin");


const PAGES_BASE = './src/pages'
const THEME_BASE = './src/theme'
let entry = {
    "styles": "./src/less/main.js"
}
let plugins = [
    new CleanWebpackPlugin('dist'),
    new ExtractTextPlugin('css/[name].[hash].css')
]


let webpackConfig = {
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
    /* entry: {
        "styles": "./src/less/main.js",
        "index": "./src/pages/index/main.js",
        "login": "./src/pages/login/main.js",
        "themeGreen": "./src/theme/green/main.js",
        "themeOrange": "./src/theme/orange/main.js",
        "themeDefault": "./src/theme/default/main.js",
    }, */
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
            'vue': 'vue/dist/vue.min.js'
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
    }
    /* plugins: [
        new CleanWebpackPlugin('dist'),
        new ExtractTextPlugin('css/[name].[hash].css'),
        // START HtmlWebpackPlugin
        new HtmlWebpackPlugin({
            title: 'index',
            template: './src/pages/index/index.html',
            filename: 'index.html',
            hash: true,
            inject: 'body',
            chunks: ['themeDefault','themeGreen', 'themeOrange', 'styles', 'vendors', 'index']
        }),
        new HtmlWebpackPlugin({
            title: 'login',
            template: './src/pages/login/index.html',
            filename: 'login.html',
            hash: true,
            inject: 'body',
            chunks: ['themeDefault','themeGreen', 'themeOrange', 'styles', 'vendors', 'login']
        }),
        // END HtmlWebpackPlugin
        new ExtractThemePlugin({
            options: ''
        })
    ] */
};

function getPagesMap() {
    const basePath = path.resolve(__dirname, PAGES_BASE);
    const pageEntries = fs.readdirSync(basePath)
    const res = {};
    pageEntries.forEach(pgEntry => {
        const tplPath = './' + path.join(PAGES_BASE, pgEntry, 'index.html').replace(/\\/g, '/')
        const entryPath = './' + path.join(PAGES_BASE, pgEntry, 'main.js').replace(/\\/g, '/')
        console.log(entryPath)

        res[pgEntry] = {
            tplPath: tplPath,
            entryPath: entryPath
        }
    })
    return res
}

function capitalize(str) {
    if (typeof str !== 'string') {
        throw Error('param must be a string');
        return;
    }
    return str.slice(0, 1).toUpperCase() + str.slice(1)
}

function getThemeMap() {
    const basePath = path.resolve(__dirname, THEME_BASE);
    const themeEntries = fs.readdirSync(basePath)
    const res = {};
    themeEntries.forEach(tmName => {
        const capitalTmName = capitalize(tmName)
        const tmEntry = `theme${capitalTmName}`
        const tplPath = './' + path.join(THEME_BASE, tmName, 'main.js').replace(/\\/g, '/')
        res[tmEntry] = tplPath
    })
    return res
}

function getEntry(entry) {
    const pagesMap = getPagesMap();
    const themesMap = getThemeMap();
    for (let pEntryName in pagesMap) {
        entry[pEntryName] = pagesMap[pEntryName].entryPath;
    }
    for (let tEntryName in themesMap) {
        entry[tEntryName] = themesMap[tEntryName]
    }
    return entry;
}

function getPlugins(plugins) {
    function _injectHtmlWebapackPlugin() {
        const themesMap = getThemeMap();
        // 在默认chunks 的前面为主题入口，后面为当前页面入口
        let chunks = ['styles', 'vendors']
        for (let tEntryName in themesMap) {
            // 前面为主题入口
            chunks.unshift(tEntryName)
        }
        const pagesMap = getPagesMap();
        for (let pEntryName in pagesMap) {
            let newChuncks = chunks.concat();
            // 后面为当前页面入口
            newChuncks.push(pEntryName)
            let htmlwebpackPlugin = new HtmlWebpackPlugin({
                template: pagesMap[pEntryName].tplPath,
                filename: `${pEntryName}.html`,
                inject: 'body',
                hash: true,
                chunks: newChuncks
            });
            plugins.push(htmlwebpackPlugin);
        }

    }

    // 注入htmlwebpackplugin
    _injectHtmlWebapackPlugin()

    // 注入主题抽出插件
    plugins.push(new ExtractThemePlugin({
        options: ''
    }))

    return plugins
}

function decoWebpackConfig(webpackConfig, entry, plugins) {
    entry = getEntry(entry)
    plugins = getPlugins(plugins)
    webpackConfig.entry = entry;
    webpackConfig.plugins = plugins
    return webpackConfig;
}

webpackConfig = decoWebpackConfig(webpackConfig, entry, plugins)

module.exports = webpackConfig;