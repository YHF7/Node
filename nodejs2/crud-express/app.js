/*
 * @Author: yhf 
 * @Date: 2018-10-02 10:06:30 
 * @Last Modified by: yhf
 * @Last Modified time: 2018-10-02 14:21:53
 */

 /**
  * app.js 入门模块
  * 职责：
  *   创建服务
  *   做一些服务相关配置
  *     模板引擎
  *     body-parser 解析表单 post 请求体
  *     提供静态资源服务
  *   挂载路由
  *   监听端口启动服务
  */

// 1.引入模块插件
const express = require('express');
const app = express();
const router = require('./router')
const bodyParser = require('body-parser');


// 2.配置模块插件
// express-art-template配置
app.engine('html', require('express-art-template'));
// 配置静态资源库
app.use('/node_modules', express.static('./node_modules'));
app.use('/public', express.static('./public'));
// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
// parse application/x-www-form-urlencoded 解析application
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json 解析
app.use(bodyParser.json());



// 3.路由
// 把路由容器挂载到 app 服务中
app.use(router)
app.use(router);



// 4.启动服务
app.listen(3000, function () {
    console.log('http://localhost:3000');
})