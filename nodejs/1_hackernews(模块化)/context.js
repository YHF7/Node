/*
 * @Author: yhf 
 * @Date: 2018-09-27 19:41:36 
 * @Last Modified by: yhf
 * @Last Modified time: 2018-09-27 20:26:01
 */

// 该模块负责 对 req 和 res 对象进行扩展

// 希望在该模块中做什么：
// 1. 为 req 增加一个 query 属性，该属性中保存的就是用户 get 请求提交过来的数据
// - req.query
// 2. 为 req 增加一个 pathname 属性
// - req.pathname
// 3. 为 res 增加一个 render 函数
const url = require('url');
const fs = require('fs');
const mime = require('mime');
const _ = require('underscore');

// 当前模块对外暴露一个函数，通过这个函数将 index.js 中的 req 和 res 传递过来
module.exports = function (req, res) {
    let urlObj = url.parse(req.url.toLowerCase(), true);
    // 1.为 req 增加 query
    req.query = urlObj.query;
    // 2. 为 res 添加 pathname 属性
    req.pathname = urlObj.pathname;

    // 3. 把 请求方法 req.method 转为小写
    req.method = req.method.toLowerCase();

    // 4.为 res 增加 render 函数
    res.render = function (filename, tplData) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                res.writeHead(404, "Not Found", {
                    "Content-Type": "text/html; charset=utf-8"
                });
                res.end("404, Page Not Found.");
                return;
            }
            // 如果用户传递了模板数组，那么就使用underscore的temlate方法进行替换
            // 如果用户 没有传递模板数组那么就不进行替换
            if (tplData) {
                // 如果用户传递了模板数据，表示进行目标替换
                let fn = _.template(data.toString('utf8'));
                data = fn(tplData);
            }
            res.setHeader("Content-Type", mime.getType(filename));
            res.end(data);
        });
    };
}


// 步骤：
// 1. 思考，该模块中要封装什么代码？
// 2. 思考，这些代码有用到外部的数据吗？如果用到了，是否需要通过参数将这些数据传递到当前模块中
// 3. 当前模块对外需要暴露的东西（module.exports的值）