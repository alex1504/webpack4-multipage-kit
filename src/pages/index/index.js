import Vue from 'vue';

const app = new Vue({
    el: '#app',
    data(){
        return {
            msg: "I'm Index Page"
        }
    },
    methods:{

    },
    mounted(){
        console.log('Hellow Vue')
    }
})