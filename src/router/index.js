/*
 * @Author: 月魂
 * @Date: 2022-07-26 15:49:17
 * @LastEditTime: 2022-07-26 15:53:47
 * @LastEditors: 月魂
 * @Description: 
 * @FilePath: \puzzle\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Puzzle',
    component: Home
  },
]

const router = new VueRouter({
  routes
})

export default router
