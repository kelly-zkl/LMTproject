// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from "element-ui";
import axios from "axios";
import VueAxios from "vue-axios";

// import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/element-variables.scss'
import "./assets/css/font-awesome.min.css";
import './assets/css/el-custom.css'
import './assets/js/util.js'
import './assets/js/api.js'

import 'babel-polyfill';

axios.defaults.withCredentials = true;
Vue.config.productionTip = true;

// axios.defaults.baseURL = "http://192.168.66.22:8086/ubus";
axios.defaults.baseURL = "/ubus";
axios.defaults.timeout = 10 * 1000;

Vue.prototype.$post = function (param, successMsg, failMsg) {
  let pa = {
    jsonrpc: "2.0", id: 1, method: "call",
    params: ["00000000000000000000000000000000", "web_lmt", "param", {"msg": JSON.stringify(param)}]
  };
  console.log(param);
  return axios.post('', pa).then((res) => {
    if (res.data.result[1].message !== undefined) {
      let data = JSON.parse(res.data.result[1].message);
      if ("000000" === data.code) {
        if (successMsg !== undefined) {
          this.$message({message: successMsg, type: 'success'});
        }
        if (data === undefined) {
          data = {};
        }
        console.log(data);
        return data;
      }
      if (failMsg !== undefined) {
        return Promise.reject(failMsg);
      }
      return Promise.reject(data.msg);
    } else {
      return Promise.reject(res.data.error.message);
    }
  }).catch((err) => {
    this.$message.error(err ? err : err.data.error.message);
  });
};

Vue.use(VueAxios, axios);

Vue.prototype.$Is_Pc = function () {
  let flag = false;
  if (window.screen.width >= 768) {
    flag = true;
  }
  return flag;
};


router.beforeEach((to, from, next) => {
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (to.path === '/login' && from !== '/login' && user) {//登录后不能返回到登录页
    return;
  }
  if (!user && to.path !== '/login') {
    next({path: '/login'})
  } else {
    next()
  }
});

Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
