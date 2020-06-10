import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入重置样式
import './assets/style/reset.css';
// 引入字体图标
import './assets/fonts/iconfont.css'
// 引入elementui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import local from '@/utils/session';


// 创建bus
const bus = new Vue();
Vue.prototype.$bus = bus;


// 路由守卫 拦截所有路由
router.beforeEach((to, from, next) => {
  // 从本地存储获取token
  let token = local.get('token')
  if (token) { // 如果token存在，证明登录成功
    next() // 放行
  } else { // 如果token不存在，证明没有登录
    // 如果要去的是登录  放行
    if (to.path === '/login') {
      next()
    } else { // 否则要去其他地址，直接跳转到登录界面
      next('/login')
    }

  }
})

Vue.config.productionTip = false
// 注册elementui
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
