import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    children: [
      // 首页
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home', title: '后台首页' }
          ]
        },
        path: '',
        component: () => import('../views/Index.vue')
      },
      // 订单管理
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/ordermanage', title: '订单管理' }
          ]
        },
        path: '/home/ordermanage',
        component: () => import('../views/Order/OrderManage.vue')
      },
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/ordermanage', title: '订单详情' }
          ]
        },
        name: 'orderdetail',
        path: '/home/orderdetail',
        component: () => import('../views/Order/OrderDetail.vue'),
      },

      // 仓库管理
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/arrivestore', title: '仓库管理' },
            { path: '/home/arrivestore', title: '入库' }
          ]
        },
        path: '/home/arrivestore',
        component: () => import('../views/StoreManage/ArriveStore.vue')
      },
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/leavestore', title: '仓库管理' },
            { path: '/home/leavestore', title: '出库' }
          ]
        },
        path: '/home/leavestore',
        component: () => import('../views/StoreManage/LeaveStore.vue')
      },
      // 货物列表
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/goodsList', title: '仓库管理' },
            { path: '/home/goodsList', title: '货物列表' }
          ]
        },
        path: '/home/goodsList',
        component: () => import('../views/StoreManage/GoodsList.vue')
      },
      // 货物信息修改
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/goodsList', title: '仓库管理' },
            { path: '/home/goodsedit', title: '货物信息修改' }
          ]
        },
        path: '/home/goodsedit',
        component: () => import('../views/StoreManage/GoodEdit.vue')
      },
      // 人事管理
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/personallist', title: '人事管理' },
            { path: '/home/personallist', title: '员工列表' }
          ]
        },
        path: '/home/personallist',
        component: () => import('../views/PersonalManage/PersonalList.vue')
      },
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/personallist', title: '人事管理' },
            { path: '/home/personaladd', title: '添加员工' }
          ]
        },
        path: '/home/personaladd',
        component: () => import('../views/PersonalManage/PersonalAdd.vue')
      },
      // 账号管理
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/accountlist', title: '账号管理' },
            { path: '/home/accountlist', title: '账号列表' }
          ]
        },
        path: '/home/accountlist',
        component: () => import('../views/AccountManage/AccountList.vue')
      },
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/accountlist', title: '账号管理' },
            { path: '/home/accountadd', title: '账号添加' }
          ]
        },
        path: '/home/accountadd',
        component: () => import('../views/AccountManage/AccountAdd.vue')
      },
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/accountlist', title: '账号管理' },
            { path: '/home/changepassword', title: '修改密码' }
          ]
        },
        path: '/home/changepassword',
        component: () => import('../views/AccountManage/ChangePassword.vue')
      },
      // 数据统计
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/storestatistics', title: '数据统计' },
            { path: '/home/storestatistics', title: '仓库统计' }
          ]
        },
        path: '/home/storestatistics',
        component: () => import('../views/DataStatistics/StoreStatistics.vue')
      },

      // 个人中心
      {
        meta: {
          breadArr: [
            { path: '/home', title: '首页' },
            { path: '/home/personalcenter', title: '个人中心' }
          ]
        },
        path: '/home/personalcenter',
        component: () => import('../views/PersonalCenter.vue')
      }

    ]
  }
]

const router = new VueRouter({

  routes
})

export default router

