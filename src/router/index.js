import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home.vue';

import DeviceSet from '../components/deviceSet/DeviceSet.vue';
import BaseSet from '../components/deviceSet/BaseSet.vue';
import DeviceOverview from '../components/deviceSet/DeviceOverview.vue';
import TerminateData from '../components/deviceSet/TerminateData.vue';
import DeviceMaintenance from '../components/deviceSet/DeviceMaintenance.vue';

import Login from '../components/Login.vue';
import PageError from '../components/404.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Home,
      icon: 'fa fa-th-large',
      index: '1',
      leaf: true,//只有一个节点
      children: [
        {path: '/deviceOverview', component: DeviceOverview, name: '设备概览', hidden: true},
      ]
    },
    {
      path: '/',
      name: '',
      component: Home,
      icon: 'fa fa-cog',
      index: '2',
      leaf: true,//只有一个节点
      children: [
        {path: '/baseSet', component: BaseSet, name: '基本设置', hidden: true},
      ]
    },
    {
      path: '/',
      name: '',
      component: Home,
      icon: 'fa fa-tachometer',
      index: '3',
      leaf: true,//只有一个节点
      children: [
        {path: '/deviceSet', component: DeviceSet, name: '设备配置', hidden: true},
      ]
    },
    {
      path: '/',
      name: '',
      component: Home,
      icon: 'fa fa-medkit',
      index: '4',
      leaf: true,//只有一个节点
      children: [
        {path: '/dm', component: DeviceMaintenance, name: '设备维护', hidden: true},
      ]
    },
    {
      path: '/',
      name: '',
      component: Home,
      icon: 'fa fa-cloud',
      index: '5',
      leaf: true,//只有一个节点
      children: [
        {path: '/terminateData', component: TerminateData, name: '侦码数据', hidden: true},
      ]
    },
    {
      path: '/login',
      name: "登录",
      hidden: true,
      component: Login
    },
    {
      path: '/404',
      name: '',
      hidden: true,
      component: PageError
    },
    {
      path: '*',
      hidden: true,
      redirect: {path: '/404'}
    }
  ]
})
