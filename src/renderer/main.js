import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import {Layout, FormModel, Input, Button, Menu, message, Drawer} from 'ant-design-vue';
import App from './App'
import router from './router'
import 'ant-design-vue/dist/antd.css';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.prototype.$message = message
Vue.use(Layout).use(FormModel).use(Input).use(Button).use(Menu).use(Drawer);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  data: {
	  HandleEvent: new Vue(),
	  server: null
  } 
}).$mount('#app')
