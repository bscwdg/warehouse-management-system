var express = require('express');
var router = express.Router();
// 引入数据库连接模块
const conn = require('./database/connect')


// 统一处理跨域问题
router.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*') // 允许访问的域名
	res.header("Access-Control-Allow-Headers", "authorization"); // 允许前端携带的头部信息
	next()
})


 // 添加员工接口 
router.post('/personaladd', (req, res) => {
	// 接收前端参数
	let { personalname, personalclass} = req.body;
	// 防止前端不传参数
	if ( !( personalname && personalclass) ) {
		res.send({code: 5001, msg: "参数错误，注意请求参数!"})
		return
	}

	// 操作数据库
	// 1. 准备sql
	const sql = `insert into personal(personalname, personalclass) values("${personalname}", "${personalclass}")`;
	// 2. 执行sql
	conn.query(sql, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, msg: "添加员工成功!"})
		} else {
			res.send({code: 1, msg: "添加员工失败!"})
		}
	})
})

/* 员工列表（分页）*/
router.get('/personallist', (req, res) => {
	// 接收参数 (当前页 每页条数) （后端： 接收前端两个参数）
	let { currentPage, pageSize } = req.query;

	if ( !(currentPage && pageSize) ) {
		res.send({code: 5001, msg: "参数错误，注意请求参数!"})
		return
	}

	// 后端： 返回给前端 数据总条数  当前页页的数据
	let total;

	// 准备sql
	let sql = `select * from personal order by id desc`;
	// 执行sql
	conn.query(sql, (err, data) => {
		if (err) throw err;
		total = data.length; // 计算总条数

		// 拼接分页sql
		let n = (currentPage - 1) * pageSize;
		sql += ` limit ${n}, ${pageSize}`;

		// 执行分页sql
		conn.query(sql, (err, data) => {
			if (err) throw err;
			res.send({ total, data }) // 响应数据给前端
		})

	})
})

/* 删除 */
router.get('/personaldel', (req, res) => {
	let { id } = req.query;

	if (!id) {
		res.send({code: 5001, msg: "参数错误，注意请求参数!"})
		return
	}

	// 操作数据库
	const sql = `delete from personal where id = ${id}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, msg: "删除成功"})
		} else {
			res.send({code: 1, msg: "删除删除失败"})
		}
	})
})

/* 批量删除 */
router.get('/personalbatchdel', (req, res) => {
	let { ids } = req.query;  // 接收参数 接收一个数组
	ids = JSON.parse(ids) // 转为数组

	if (!ids.length) {
		res.send({code: 5001, msg: "参数错误，注意请求参数!"})
		return
	}

	// 操作数据库
	const sql = `delete from personal where id in (${ids.join(',')})`;
	conn.query(sql, (err, data) => {
		if (err) throw err;  
		if (data.affectedRows > 0) {
			res.send({code: 0, msg: '批量删除成功'})
		} else {
			res.send({code: 1, msg: '批量删除失败'})
		}
	})
})

/* 编辑(修改账号) */
router.post('/personaledit', (req, res) => {
	let { personalname, personalclass, id } = req.body

	if ( !(personalname && personalclass && id) ) {
		res.send({code: 5001, msg: "参数错误，注意请求参数!"})
		return
	}

	// 操作数据库
	const sql = `update personal set personalname="${personalname}", personalclass="${personalclass}" where id=${id}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, msg: "修改成功"})
		} else {
			res.send({code: 1, msg: "修改失败"})
		}
	})
})


module.exports = router;