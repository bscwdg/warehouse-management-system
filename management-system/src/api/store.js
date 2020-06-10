/**
 * 货物管理接口 --- 接口层
 */

import req from '@/utils/request'

// 入库
export const arriveStore = params => req.post('/store/arrivestore', params)
// 出库
export const leaveStore = params => req.post('/store/leavestore', params)

// 获取货物列表
export const getGoodsList = params => req.get('/store/goodslist', params)
//删除货物
export const goodsDel = params => req.get('/store/goodsdel', params)
// 编辑货物
export const goodsEdit = params => req.post('/store/goodsedit', params)
//获取入库信息
export const getArriveStoreInfo = params => req.get('/store/arrivestoreinfo', params)
//获取出库信息
export const getLeaveStoreInfo = params => req.get('/store/leavestoreinfo', params)

