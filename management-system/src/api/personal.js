/* 
*员工管理接口
 */
import req from '@/utils/request'

// 添加员工
export const addPersonal = params => req.post('/personal/personaladd', params)

// 2获取员工列表
export const getPersonalList = params => req.get('/personal/personallist', params)

// 3删除员工
export const delPersonal = params => req.get('/personal/personaldel', params)

// 4批量删除
export const batchdel = params => req.get('/personal/personalbatchdel', params)

// 5编辑员工
export const editPersonal = params => req.post('/personal/personaledit', params)


