import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home.vue';

import BandSet from '../components/deviceSet/BandSet.vue';
import BaseSet from '../components/deviceSet/BaseSet.vue';
import DeviceOverview from '../components/deviceSet/DeviceOverview.vue';
import TerminateData from '../components/deviceSet/TerminateData.vue';
import NetworkSet from '../components/deviceSet/NetworkSet.vue';

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
        {path: '/bandSet', component: BandSet, name: '载波配置', hidden: true},
      ]
    },
    // {
    //   path: '/',
    //   name: '',
    //   component: Home,
    //   icon: 'fa fa-dribbble',
    //   index: '4',
    //   leaf: true,//只有一个节点
    //   children: [
    //     {path: '/networkSet', component: NetworkSet, name: '网络配置', hidden: true},
    //   ]
    // },
    {
      path: '/',
      name: '',
      component: Home,
      icon: 'fa fa-cloud',
      index: '6',
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
