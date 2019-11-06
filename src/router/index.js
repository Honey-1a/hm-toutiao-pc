import VueRouter from 'vue-router'
import Vue from 'vue'

import Login from '@/views/login'
import Home from '@/views/home'
import welcome from '@/views/welcome'
import NotFound from '@/views/404'
import local from '@/utils/local.js'
import article from '@/views/article'
import image from '@/views/image'
import publish from '@/views/publish'
import comment from '@/views/comment'
Vue.use(VueRouter)

// 通过本地是否存储信息判断用户是否登录
// 在跳转路由前判断是否登录
// 如果访问的不是登录页面，并且还没登录，跳转到登录页面
// 路由导航守卫
// router.beforeEach(()=>每一次跳转路由会执行)

const router = new VueRouter({

  routes: [{
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Home,
    children: [{
      path: '/',
      component: welcome
    },
    {
      path: '/article',
      component: article
    },
    {
      path: '/image',
      component: image
    },
    {
      path: '/publish',
      component: publish
    },
    {
      path: '/comment',
      component: comment
    },
    {
      path: '*',
      component: NotFound
    }
    ]
  }

  ]
})
router.beforeEach((to, from, next) => {
  const user = local.getUser()
  // 如果访问的不是登录页面，并且还没登录，跳转到登录页面
  if (to.path !== '/login' && !user) return next('/login')
  next()
})
export default router
