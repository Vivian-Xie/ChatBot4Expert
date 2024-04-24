import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import contextmenu from './components/ContextMenu/index.js'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(ElementUI);
Vue.use(IconsPlugin);
Vue.use(contextmenu, {name: 'contextmenu'})

new Vue({
  render: h => h(App),
}).$mount('#app')
