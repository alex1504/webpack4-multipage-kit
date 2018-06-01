import Vue from 'vue';

const app = new Vue({
    el: '#app',
    data() {
        return {
            THEME_CONFIG: window.THEME_CONFIG,
            THEME_NAME_ARR: Object.keys(THEME_CONFIG),
            msg: "I'm Index Page"
        }
    },
    methods: {
        changeTheme(themeName) {
            const themeNode = $("<link rel='stylesheet'>");
            const href = this.THEME_CONFIG[themeName];
            let flag = false;
            themeNode.attr('href', href)
            $("link").each((index, el) => {
                if ($(el).attr('href').indexOf('theme') !== -1) {
                    const oldHref = $(el).attr('href');
                    if (oldHref !== href) {
                        $(el).remove();
                        flag = true;
                    }
                }
            })
            if (flag) {
                $("head").append(themeNode)
            }
        }
    },
    mounted() {
        console.log('Hellow Vue')
    }
})

