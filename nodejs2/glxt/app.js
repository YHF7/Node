/*
 * @Author: yhf 
 * @Date: 2018-10-04 13:06:08 
 * @Last Modified by: yhf
 * @Last Modified time: 2018-10-04 13:21:45
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

// 1.添加模块
// 前端模块
const express = require('express');
// 路由处理
const router = require('./router');
// 公共页 处理服务端口等
const public = require('./public');
// post 传输获取插件 
const bodyParser = require('body-parser');

// 2.创建服务
const app = express();


// 3. 配置插件
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


// 4.挂载路由
// 把路由容器挂载到 app 服务中
app.use(router);

// 5.开启服务
app.listen(public.port, function () {
    console.log('http://localhost:' + public.port);
})