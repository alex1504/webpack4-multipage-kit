const path = require('path')

function ExtractThemePlugin(options) {
    this.options = options
}

ExtractThemePlugin.prototype.apply = function (compiler) {
    let THEME_CONFIG = {};
    compiler.plugin('compilation', (compilation) => {
        compilation.plugin(
            'html-webpack-plugin-before-html-processing',
            (data) => {
                const areaJson = JSON.parse(data.plugin.assetJson);
                const originHtml = data.html;
                console.log(areaJson)
                areaJson.forEach(outputPath => {
                    if (outputPath.indexOf('css/theme') !== -1) {
                        const match = outputPath.match(/(theme\w*)\./)[1];
                        THEME_CONFIG[match] = outputPath;
                    }
                });
                const tConfScript = `
                    <script>window.THEME_CONFIG = ${JSON.stringify(THEME_CONFIG)}</script>
                `;
                const initThemeScript = `
                <script>
                    window.onload = function(){
                       const themeName = window.THEME;
                       const themeKey = 'theme' + themeName.slice(0,1).toUpperCase() + themeName.slice(1);
                       const href = THEME_CONFIG[themeKey];
                       const link = document.createElement('link');
                       link.rel = 'stylesheet';
                       link.href = href;
                       document.querySelector('head').appendChild(link)
                    }
                </script>`;
                data.html = originHtml.toString().split('</head>')[0];
                data.html += tConfScript;
                data.html += initThemeScript;
                data.html += '</head>';
                data.html += originHtml.toString().split('<head>')[1];
            }
        );
        compilation.plugin(
            'html-webpack-plugin-alter-asset-tags',
            (data) => {
                console.log(data, '!!!!!!')
                // Remove theme css link
                let index = data.head.length - 1;
                while (index >= 0) {
                    let tag = data.head[index];
                    if (tag.tagName === 'link' && /css\/theme/.test(tag.attributes.href)) {
                        console.log(tag.attributes.href, '*****************************')
                        data.head.splice(index, 1)
                    }
                    index--;
                }
                // Remove rest scripts
                let iIndex = data.body.length - 1;
                while (iIndex >= 0) {
                    let tag = data.body[iIndex];
                    if (tag.tagName === 'script' && /theme|styles/.test(tag.attributes.src)) {
                        console.log(tag.attributes.src, '*****************************')
                        data.body.splice(iIndex, 1)
                    }
                    iIndex--;
                }
            }
        )
    })
};

module.exports = ExtractThemePlugin;