var express = require('express');
var router = express.Router();

// 引入数据库连接模块
const conn = require('./database/connect')
const fs = require('fs');
var multer = require('multer'); // 上传的模块


// 统一处理跨域问题
router.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*') // 允许访问的域名
	res.header("Access-Control-Allow-Headers", "authorization"); // 允许前端携带的头部信息
	next()
})



var storage = multer.diskStorage({
	destination: 'public/upload/goods', // 
	filename: function (req, file, cb) {
		// 处理文件格式
		var fileFormat = (file.originalname).split(".");
		// 获取当前时间戳 用于重命名 
		var filename = new Date().getTime();
		cb(null, filename + "." + fileFormat[fileFormat.length - 1]); // 拼接文件名
	}
});

// 上传对象
var upload = multer({
	storage
});


// 货物图片上传
router.post('/upload', upload.single('file'), (req, res) => {

	console.log(req.file)

	let { filename } = req.file;
	res.send({ code: 0, msg: "上传成功!", imgUrl: filename })


})

// 货物入库
router.post('/arrivestore', (req, res) => {
	// 接收前端参数
	let { goodscoding, goodsname, goodscategory, imgUrl, goodsdesc, goodsquantity } = req.body;
	// 防止前端不传参数
	if (!(goodscoding && goodsname && goodscategory && imgUrl && goodsdesc && goodsquantity)) {

		res.send({ code: 5001, msg: "参数错误，注意请求参数!" })
		return
	}
	// 判断货物是否存在 存在则只添加数量
	const sql1 = `select * from goods where goodsname = '${goodsname}' `;
	// 1. 准备sql
	const sql4 = `insert into arrivestore(goodscoding,goodsname,goodscategory,imgUrl,goodsdesc,goodsquantity) values("${goodscoding}", "${goodsname}", "${goodscategory}", "${imgUrl}","${goodsdesc}","${goodsquantity}")`;
	conn.query(sql1, (err, data) => {
		// console.log(data)
		if (data.length > 0) {
			// 存在 只增加数量
			// console.log(data[0].id)
			// 类型转换
			goodsquantity = parseInt(goodsquantity) + parseInt(data[0].goodsquantity)
			// console.log(goodsquantity )
			// 操作数据库
			const sql2 = `update goods set  goodsquantity ="${goodsquantity}" where goodsname = '${goodsname}'`;
			conn.query(sql2, (err, data) => {
				if (err) throw err;
				if (data.affectedRows > 0) {
					res.send({ code: 0, msg: "货物已存在，数量增加成功" })
				} else {
					res.send({ code: 1, msg: "货物入库失败" })
				}
			});
			// 2. 执行sql4
			conn.query(sql4, (err, data) => {
				if (err) throw err;
				if (data.affectedRows > 0) {
					console.log('写入入库数据库成功')
				} else {
					console.log('写入入库数据库失败')
				}
			})

		} else {
			// 不存在 入库
			// 1. 准备sql
			const sql3 = `insert into goods(goodscoding,goodsname,goodscategory,imgUrl,goodsdesc,goodsquantity) values("${goodscoding}", "${goodsname}", "${goodscategory}", "${imgUrl}","${goodsdesc}","${goodsquantity}")`;
			// 2. 执行sql
			conn.query(sql3, (err, data) => {
				if (err) throw err;
				if (data.affectedRows > 0) {
					res.send({ code: 0, msg: "货物入库成功!" })
				} else {
					res.send({ code: 1, msg: "货物入库失败!" })
				}
			})
			// 存入入库数据库
			// 不存在 入库
			
			// 2. 执行sql4
			conn.query(sql4, (err, data) => {
				if (err) throw err;
				if (data.affectedRows > 0) {
					console.log('写入入库数据库成功')
				} else {
					console.log('写入入库数据库失败')
				}
			})
		}
	})

})

//货物出库
router.post('/leavestore',(req,res) => {
	// 接收参数
	let { goodsname, leavequantity } = req.body
	// 防止不传参
	if (!(goodsname && leavequantity)) {
		res.send({ code: 5001, msg: "参数错误，注意请求参数!" })
		return
	}
	let goodsquantity = 0;
	// 判断货物是否存在 
	const sql1 = `select * from goods where goodsname = '${goodsname}' `;
	// 写入出库数据库
	const sql4 = `insert into leavestore(goodsname, leavequantity) values("${goodsname}","${leavequantity}")`;
	
	conn.query(sql1, (err, data) => {
		if (err) throw err;
		// console.log(data)
		if (data.length > 0) {
			// 存在 出库减少数量
			// console.log(data[0].id)
			// 类型转换
			// 判断出库数量
			if (parseInt(data[0].goodsquantity) > parseInt(leavequantity)) {
				// 出库
				goodsquantity = parseInt(data[0].goodsquantity) - parseInt(leavequantity)
				// console.log(goodsquantity )
				// 操作数据库
				const sql2 = `update goods set  goodsquantity ="${goodsquantity}" where goodsname = '${goodsname}'`;
				conn.query(sql2, (err, data) => {
					if (err) throw err;
					if (data.affectedRows > 0) {
						res.send({ code: 0, msg: "货物出库成功" })
					} else {
						res.send({ code: 1, msg: "货物出库失败，请重试！" })
					}
				})
				// 2. 执行sql4
			conn.query(sql4, (err, data) => {
				if (err) throw err;
				if (data.affectedRows > 0) {
					console.log('写入出库数据库成功')
				} else {
					console.log('写入出库数据库失败')
				}
			})

			} else if (parseInt(data[0].goodsquantity) === parseInt(leavequantity)) {
				// 删除货物
				const sql3 = `delete from goods where goodsname = '${goodsname}'`;
				conn.query(sql3, (err, data) => {
					if (err) throw err;
					if (data.affectedRows > 0) {
						res.send({ code: 0, msg: "货物出库成功，货物库存为0，已删除" })
					} else {
						res.send({ code: 1, msg: "货物出库失败，请重试！" })
					}
				})
				// 2. 执行sql4
			conn.query(sql4, (err, data) => {
				if (err) throw err;
				if (data.affectedRows > 0) {
					console.log('写入出库数据库成功')
				} else {
					console.log('写入出库数据库失败')
				}
			})
			} else {
				// 货物数量不足
				res.send({ code: 1, msg: "货物数量不足，出库失败，请重试！" })
			}


		} else {
			// 货物不存在 无法出库
			res.send({ code: 1, msg: "货物不存在，出库失败，请重试！" })

		}
	})
})

/* 获取货物列表 模糊查询*/
router.get('/goodslist', (req, res) => {
	let { currentPage, pageSize,goodsCoding,goodsName } = req.query;

	if (!(currentPage && pageSize)) {
		res.send({ code: 5001, msg: "参数错误!" })
		return;
	}

	let sql = `select * from goods where 1 = 1`;
	if (goodsCoding) {
        sql += ` and goodscoding like "%${goodsCoding}%"`;
    }

    if (goodsName) {
        sql += ` and goodsname like "%${goodsName}%"`

    }
       
    // console.log(sql)
	let total;

	conn.query(sql, (err, data) => {
		if (err) throw err;
		total = data.length;

		let n = (currentPage - 1) * pageSize;
		sql += ` order by ctime desc limit ${n}, ${pageSize}`;

		conn.query(sql, (err, data) => {
			if (err) throw err;
			res.send({
				total,
				data
			})
		})
	})
})

// 删除货物
router.get('/goodsdel', (req, res) => {
	let { id } = req.query;

	if (!id) {
		res.send({ code: 5001, msg: "参数错误!" })
		return;
	}

	const sql = `delete from goods where id = ${id}`;
	conn.query(sql, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({ code: 0, msg: '删除成功!' })
		}
	})
})
// 修改货物信息
router.post('/goodsedit', (req, res) => {
	let { id,goodscoding, goodsname, goodscategory, imgUrl, goodsdesc, goodsquantity } = req.body;
	// 防止前端不传参数
	if (!(id&&goodscoding && goodsname && goodscategory && imgUrl && goodsdesc && goodsquantity)) {

		res.send({ code: 5001, msg: "参数错误，注意请求参数!" })
		return
	}

	const sql = `update goods set goodscoding="${goodscoding}", goodsname="${goodsname}", goodscategory="${goodscategory}", 
	 imgUrl="${imgUrl}", goodsdesc="${goodsdesc}",goodsquantity="${goodsquantity}" where id=${id}`;

	 console.log(sql)

	conn.query(sql, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, msg: '修改货物成功!'})
		} else {
			res.send({code: 1, msg: '修改货物失败!'})
		}
	})

})

// 获取入库信息
router.get('/arrivestoreinfo', (req, res) => {
	

	// 准备sql
	let sql = `select * from arrivestore order by ctime `;
	// 执行sql
	conn.query(sql, (err, arrivedata) => {
		if (err) throw err;
		res.send({ arrivedata }) // 响应数据给前端
		

	})
})
// 获取出库信息
router.get('/leavestoreinfo', (req, res) => {
	

	// 准备sql
	let sql = `select * from leavestore order by ctime`;
	// 执行sql
	conn.query(sql, (err, leavedata) => {
		if (err) throw err;
		res.send({ leavedata }) // 响应数据给前端
		

	})
})
module.exports = router;
