// 引入模块 
const mysql = require('mysql')
		
// 创建连接对象
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',   // 数据库用户名
	password: 'root', // 数据库密码
	database: 'management'   // 数据库的名字
})
		
// 连接
conn.connect()

console.log('database is coonect')

// 导出
module.exports = conn;