/*
 请求封装 
 by 顾郑凯
 */
// 引入库
import axios from 'axios'
import qs from 'qs'
// 引入本地存储工具函数
import local from "@/utils/session";


// 按需引入组件
import { Message, MessageBox } from 'element-ui'
// 设置默认请求的接口地址
axios.defaults.baseURL = 'http://127.0.0.1:5000'

// 请求拦截器
axios.interceptors.request.use(config => {
    // config是请求的配置对象，如果直接返回 就等于什么都不带

    // 所有的axios请求，在请求发送出去之前带上token
    let token = local.get('token')
    config.headers.Authorization = 'Bearer ' + token

    return config;
}, error => {
    return Promise.reject(error); // 请求错误处理
})

// 响应拦截器
axios.interceptors.response.use(response => {
    // response就是后端响应回来的东西 如果你想做什么统一的处理 可以在这里写
    let { code, msg } = response.data;
    // 成功
    if (code === 0) {
        Message({
            type: 'success',
            message: msg
        })
    } else if (code === 1) {
        // 失败
        Message.error(msg)
    }
    return response;

}, error => {

    MessageBox.alert('尝试重新登录', '网络错误', {
        confirmButtonText: '确定',
        callback: () => {

            window.location.href = '/login'
        }
    })

    return Promise.reject(error); // 响应错误处理
});


// 导出两个方法
export default {
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, { params })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    post(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params))
                .then(res => {
                    resolve(res.data)


                })
                .catch(err => {
                    reject(err)


                })
        })
    }
}
