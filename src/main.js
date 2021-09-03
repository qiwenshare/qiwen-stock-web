import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from '@/store/index.js'
import globalFunction from '@/globalFunction.js'
import '@/assets/styles/css/base.css'
import '@/assets/styles/css/border.css'
import '@/assets/styles/iconfont/iconfont.css'
import '@/assets/styles/css/element-cover.css'
import '@/assets/styles/css/mediaScreen.styl'
import '@/router/before.js'
import 'element-ui/lib/theme-chalk/index.css'
import element from './element.js'

Vue.config.productionTip = false;
Vue.use(element);

for(let key in globalFunction) {
  Vue.prototype[key] = globalFunction[key]
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')