import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: { name: 'Stock' }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      meta: { title: '登录 - 奇文股票' }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
      meta: { title: '注册 - 奇文股票' }
    },
    {
      path: '/stock',
      name: 'Stock',
      component: () => import(/* webpackChunkName: "stock_list" */ '@/views/Stock/StockList.vue'),
      meta: {
        requireAuth: true,
        title: '奇文股票',
        content: {
          description:
            '基于Springboot + Vue CLI@3 框架开发的股票分析系统，包含数据爬取，指标计算，数据分析，数据展示，复盘回顾，数据预测等功能'
        }
      }
    },
    {
      path: '/stock/detail/:stockNum',
      name: 'StockDetail',
      component: () => import(/* webpackChunkName: "stock_detail" */ '@/views/Stock/StockDetail.vue'),
      meta: { title: '股票详情 - 奇文股票' }
    },
    {
      path: '*',
      name: 'Error_404',
      component: () => import(/* webpackChunkName: "404" */ '@/views/ErrorPage/404.vue'),
      meta: { title: '404 - 奇文股票' }
    }
  ]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

