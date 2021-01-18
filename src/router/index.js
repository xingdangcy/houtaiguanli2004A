import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/admin/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/admin/home'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        name: 'wlecome',
        component: () => import('../views/admin/Welcome'),
      },
      {
        path:'/users',
        name: 'users',
        component: () => import('../views/admin/user/Users'),
      },
      {
        path:'/rights',
        name: 'rights',
        component: () => import('../views/admin/power/Rights'),
      },
      {
        path:'/roles',
        name: 'roles',
        component: () => import('../views/admin/power/Roles'),
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
