import {theme} from '../config/index'
import Vue from 'vue'

export default {
    install(Vue,options){
        Vue.mixin({
            mounted: function () {
                const script = document.createElement('script');
                script.innerText = `window.THEME = '${theme.name}'`;
                document.querySelector('head').appendChild(script);
            }
        })
    }
}