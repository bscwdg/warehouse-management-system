const express = require('express')
const router = express.Router()

const conn = require('./database/connect')

router.all('*', (req, res, next) => {
    // 先设置响应头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "authorization"); // 允许携带的请求头
    // 给其他路由放行
    next();
})

/* 获取订单列表 && 带查询功能 */
router.get('/orderlist', (req, res) => {

    let { currentPage, pageSize, orderNo, consignee, phone, orderState, date } = req.query;

    if (!(currentPage && pageSize)) {
        res.send({ code: 5001, msg: "参数错误!" })
        return;
    }

    let sql = `select * from orders where 1 = 1`;

    if (orderNo) {
        sql += ` and orderNo like "%${orderNo}%"`;
    }

    if (consignee) {
        sql += ` and consignee like "%${consignee}%"`
    }

    if (phone) {
        sql += ` and phone like "%${phone}%"`
    }

    if (orderState) {
        sql += ` and orderState = "${orderState}"`
    }

    date = JSON.parse(date)
    if (date.length) {
        sql += ` and orderTime between "${date[0]}" and "${date[1]}"`
    }

    sql += ` order by orderTime desc`;

    console.log(sql)


    let total;
    conn.query(sql, (err, data) => {
        if (err) throw err;
        total = data.length;

        let n = (currentPage - 1) * pageSize;
        sql += ` limit ${n}, ${pageSize}`;

        conn.query(sql, (err, data) => {
            if (err) throw err;
            res.send({
                total,
                data
            })
        })
    })
})

/* 获取订单详情 */
router.get('/orderdetail', (req, res) => {
    let { id } = req.query;

    if (!id) {
        res.send({ code: 5001, msg: '参数错误!' })
        return
    }

    const sql = `select * from orders where id=${id}`;
    conn.query(sql, (err, data) => {
        if (err) throw err;
        res.send({ data: data[0] })
    })
})

/* 保存修改 */
router.post('/orderedit', (req, res) => {
    let { orderNo, orderTime, phone, consignee, deliverAddress, deliveryTime, remarks, orderAmount, orderState, id } = req.body;

    if (!(orderNo && orderTime && phone && consignee && deliverAddress && deliveryTime && remarks && orderAmount && orderState)) {
        res.send({ code: 5001, msg: "参数错误!" })
        return;
    }

    const sql = `update orders set orderNo="${orderNo}", orderTime="${orderTime}", phone="${phone}", consignee="${consignee}", 
	deliverAddress="${deliverAddress}", deliveryTime="${deliveryTime}", remarks="${remarks}", orderAmount="${orderAmount}", 
	orderState="${orderState}" where id=${id}`;


    conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data.affectedRows > 0) {
            res.send({
                code: 0,
                msg: '修改订单成功!'
            })
        }
    })
})



module.exports = router;