/*
 * @Author: yhf 
 * @Date: 2018-09-27 19:30:52 
 * @Last Modified by: yhf
 * @Last Modified time: 2018-09-28 17:41:46
 */
// 模块一（服务模块），负责使用
// 模块二（扩展模块），负责扩展 req 和 res 对象，为 req 和 res 增加以下更方便好用的API
// 模块三（路由模块），负责路由判断
// 模块四（业务模块），负责处理具体路由的业务代码
// 模块五（数据操作），负责进行数据库
// 模块六（配置模块），负责保存各种项目中用到的配置信息



// 1.加载 http 模块
const http = require("http");

// 加载context模块
let context = require('./context.js');

let router = require('./router.js');
let config = require('./config.js');



// 2.创建服务
http.createServer(function (req, res) {
  
  // 调用 context.js 模块的返回值（函数），并将 req 和 res 对象传递给 context.js 模块
  context(req,res);

  // 调用 router.js 路由模块的返回值（函数），并将 req 和 res 对象传递给 router.js 模块
  router(req,res);

}).listen(config.port, function () {
  console.log('http://localhost:'+config.port);
});

