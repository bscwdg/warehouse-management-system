var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 引入路由
var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var orderRouter = require('./routes/order');
var personalRouter = require('./routes/personal');
var storeRouter = require('./routes/store');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 分配路由
app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/order', orderRouter);
app.use('/personal', personalRouter);
app.use('/store', storeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// 手动监听端口
app.listen(5000, () => {
  console.log('http://127.0.0.1:5000')
})

module.exports = app;
