import Vue from 'vue';

const app = new Vue({
    el: '#app',
    data(){
        return {
            msg: "I'm Index Page"
        }
    },
    methods:{
        changeToATheme(){
            let themeNode = $("<link rel='stylesheet'>");
            themeNode.attr('href', 'css/themeA.css')
            $("link").each((index, el)=>{
                if($(el).attr('href').indexOf('theme') !== -1){
                    $(el).remove()
                }
            })
            $("link").eq(0).before(themeNode)
        }
    },
    mounted(){
        console.log('Hellow Vue')
    }
})