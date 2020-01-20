import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import '../assets/css/globalcss.css'
import axios from 'axios'
import home from '../components/home'
import user from '../components/users/user'
import welcome from '../components/welcome'
Vue.prototype.$http = axios
/* 配置请求的路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

/* axios调用除login之外的接口都需携带token,放入header中 */
axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: user }
    ] }
]

const router = new VueRouter({
  routes
})

/* 给router挂载路有导航守卫,防止没有token也可以去其他页面 */
router.beforeEach((to, from, next) => {
/*  to 将要访问的路径
  from 代表从哪个路径来的
  next是一个函数,表示方向 */
  if (to.path === '/login') {
    return next()
  } else {
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
  }
})
export default router
