import Vue from 'vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import localeEN from 'element-ui/lib/locale/lang/en'
import localeFR from 'element-ui/lib/locale/lang/fr'
import localeNL from 'element-ui/lib/locale/lang/nl'

let locale = localeEN;
const loc = abp.localization.currentCulture.name;
if (loc == 'fr') {
    locale = localeFR;
} else if (loc == 'nl') {
    locale = localeNL;
}

Vue.use(ElementUI, { locale });

import VueCrud from 'vuecrud'
import Layout from './layout.vue'

VueCrud.createApp('#app', Layout);