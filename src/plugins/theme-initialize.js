import Vue from 'vue'
import vueExtend from './vue-extend';
import {THEME_CONFIG} from '../config/index'

Vue.use(vueExtend);

export default {
    install(){
        Vue.mixin({
            created: function () {
                const themeList = THEME_CONFIG.list;

                let themeKey = this.getTheme();
                console.log(themeKey)
                if(!themeKey){
                    themeKey = themeList[THEME_CONFIG.select].key
                }
                const script = document.createElement('script');
                script.innerText = `window.THEME = '${themeKey}'`;
                document.querySelector('head').appendChild(script);
            }
        })
    }
}