import Vue from 'vue'
import App from './app.vue'

// mount
new Vue({
    el: '#app-root',
    render: (h: any) => h(App, {
        props: { propMessage: 'World' }
    })
})