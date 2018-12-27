import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import localeEN from 'element-ui/lib/locale/lang/en';
import localeFR from 'element-ui/lib/locale/lang/fr';
import localeNL from 'element-ui/lib/locale/lang/nl';
import localeDE from 'element-ui/lib/locale/lang/de';
import localePT from 'element-ui/lib/locale/lang/pt';
import localeES from 'element-ui/lib/locale/lang/es';
import localeIT from 'element-ui/lib/locale/lang/it';

let locale = localeEN;
const loc = abp.localization.currentCulture.name;
if (loc == 'fr') {
    locale = localeFR;
} else if (loc == 'nl') {
    locale = localeNL;
} else if (loc == 'de') {
    locale = localeDE;
} else if (loc == 'pt') {
    locale = localePT;
} else if (loc == 'es') {
    locale = localeES;
} else if (loc == 'it') {
    locale = localeIT;
}

Vue.use(ElementUI, { locale });

import VueCrud from 'vuecrud';
import Layout from './layout.vue';

VueCrud.createApp('#app', Layout);