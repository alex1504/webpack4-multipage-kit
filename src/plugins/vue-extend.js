import Vue from 'vue'
import {
    THEME_CONFIG
} from '../config/index'


export default {
    install() {
        // 修改主题
        Vue.prototype.changeTheme = function () {
            function _getRandomTheme() {
                let themeList = THEME_CONFIG.list;
                let maxLen = themeList.length;
                let random = Math.floor(Math.random() * maxLen);
                let theme = themeList[random];
                let themeKey = theme.key;
                if (themeKey == window.THEME) {
                    return _getRandomTheme()
                } else {
                    return theme;
                }
            }
            const randomTheme = _getRandomTheme()
            const themeKey = randomTheme.key;
            const themeName = randomTheme.name;
            const themeHref = window.THEME_CONFIG[themeKey];
            document.querySelector('#theme').setAttribute('href', themeHref);
            window.THEME = themeKey;
            $.toast(`已切换，当前为${themeName}`, 1000)
        }
        // 本地保存主题
        Vue.prototype.saveTheme = function () {
            localStorage.setItem('d2-theme', window.THEME);
            $.toast(`已保存主题到本地`, 1000)
        }
        // 获取本地主题
        Vue.prototype.getTheme = function () {
            return localStorage.getItem('d2-theme')
        }
    }
}