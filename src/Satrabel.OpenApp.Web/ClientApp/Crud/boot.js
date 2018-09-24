import Vue from 'vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
Vue.use(ElementUI, { locale });

import VueCrud from 'vuecrud'
import Layout from './layout.vue'

VueCrud.createApp('#app', Layout);