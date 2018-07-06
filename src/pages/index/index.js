import Vue from '../../js/vuemaker';
import Util from '../../js/utils';

new Vue({
    el: '#app',
    data() {
        return {
            msg: "I'm Index Page"
        }
    },
    methods: {
      
    },
    mounted() {
        console.log('Hellow Vue')
    }
})