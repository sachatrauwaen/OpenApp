import Vue from 'vue'
import App from './app.vue'

import Test from './test.vue'

// mount
new Vue({
    el: '#app-root',
    render: h => h(App, {
        props: { propMessage: 'World' }
    })
})