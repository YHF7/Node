/*
 * @Author: yhf 
 * @Date: 2018-09-27 20:43:32 
 * @Last Modified by: yhf
 * @Last Modified time: 2018-09-28 17:49:45
 */

// 该模块负责对具体的业务进行处理
// 步骤：
// 1. 思考，该模块中要封装什么代码？
// 2. 思考，这些代码有用到外部的数据吗？如果用到了，是否需要通过参数将这些数据传递到当前模块中
// 3. 当前模块对外需要暴露的东西（module.exports的值）

const fs = require("fs");
const path = require("path");
const querystring = require("querystring");
const config = require('./config.js');

// 处理请求 / 和 /index 的业务方法
module.exports.index = function (req, res) {
    // 1.调用readNewsData函数读取 data.json 文件中的数据 并将读取到的数据 转化为list 数组 返回过来
    readNewsData(function (list) {
        // 因为现在要渲染的index.html 中需要用到模板数据，所以render 函数添加第二个参数
        // 第二个参数的作用就是用来传递 html 中要使用的模板数据
        res.render(path.join(config.viewPath, 'index.html'), {
            list: list
        });
    });
}

// 处理 /sjbmit 的业务方法
module.exports.submit = function (req, res) {
    // 1.读取 submit.html 并返回
    res.render(path.join(config.viewPath, "submit.html"));
}


// 处理 /item 的业务方法（显示新闻详情）
module.exports.item = function (req, res) {
    // 1. 获取当前用户请求的新闻的 id
    // urlObj.query.id 
    // 2. 读取 data.json 文件中的数据，根据 id 找到对应新闻
    readNewsData(function (list_news) {
        var model = null;

        // 循环 list_news 中的数据，找到和 id 值相等的数据
        for (var i = 0; i < list_news.length; i++) {

            // 判断集合中是否有与用户提交的 id 相等的新闻
            if (list_news[i].id.toString() === req.query.id) {
                // 如果找到了相等的新闻，则将其记录下来
                model = list_news[i];
                break;
            }
        }
        if (model) {
            // 3. 调用 res.render() 函数进行模板引擎的渲染
            res.render(path.join(config.viewPath, 'details.html'), {
                item: model
            });
        } else {
            res.end('No Such Item');
        }
    });
}

// 处理 get 方式添加新闻
module.exports.addGet = function (req, res) {
    // 1.读取data.json文件内容
    readNewsData(function (list) {
        // 2.
        // 把新闻 添加到 list 之前，为新闻添加一个id
        req.query.id = list.length;
        // 把用户提交过来的新闻数据保存到 data.json 文件中
        list.push(req.query);
        // 3.写入 data.json 文件
        writeNewsData(JSON.stringify(list), function () {
            // 4.重定向
            res.statusCode = 302;
            res.statusMessage = "Found";
            res.setHeader("Location", "/");
            // 结束响应
            res.end();
        });
    });
}

// 处理 post 方式添加新闻
module.exports.addPost = function (req, res) {
    // 1.读取 data.json 文件中的数据 并将读取到的数据 转化为list 数组
    // 2.在服务器端使用模版引擎，将 list 中的数据和index。html文件中的内容结合 渲染
    // 表示 post 方法提交一条新闻
    // 1.读取 data.json 文件中到数据
    readNewsData(function (list) {

        // 2.读取用户post提交的数据
        postBodyData(req, function (postBody) {

            // 3.为用户提交的新闻添加 id 属性，并把对象 push 到 list 中
            // 把新闻 添加到 list 之前，为新闻添加一个id
            postBody.id = list.length;
            // 将用户提交的新闻 push 到 list 中
            list.push(postBody);

            // 4.为新的 list 数组，在写入到 data.json 文件中
            writeNewsData(JSON.stringify(list), function () {
                // 5.重定向
                res.statusCode = 302;
                res.statusMessage = "Found";
                res.setHeader("Location", "/");
                // 结束响应
                res.end();
            });
        });
    });
}

// 处理静态资源请求
module.exports.static = function (req,res) {
    // 如果用户请求是以 / reqouces 开头，并且是 get 请求，就认为用户是要请球静态资源
    res.render(path.join(__dirname, req.url));
}

// 处理 404 错误请求

module.exports.handleErrors = function (req,res) {
    res.writeHead(404, "Not Found", {
        "Content-Type": "text/html; charset=utf-8"
    });
    res.end("404, Page Not Found.");
}





// 封装一个读取文件的函数
function readNewsData(callback) {
    fs.readFile(config.dataPath, 'utf8', function (err, data) {
        if (err && err.code !== 'ENOENT') {
            throw err;
        }
        // 读取到的新闻数据
        var list = JSON.parse(data || '[]');
        // 对通过调用回到函数 callback（）将读取的数据 list 传递出去
        callback(list);
    });
}

// 封装一个写入到data.json 的函数
function writeNewsData(data, callback) {
    fs.writeFile(path.join(__dirname, 'data', 'data.json'), data,
        function (err) {
            if (err) {
                throw err;
            }
            // 调用 callback 来调用写入数据完毕后的操作
            callback();
        });
}

// 封装一个获取用户 post 提交数据的方法
function postBodyData(req, callback) {
    let array = [];
    req.on("data", function (chunk) {
        array.push(chunk);
    });
    req.on("end", function () {
        let postBody = Buffer.concat(array);
        // 把获取到的buffer对象转字符串
        postBody = postBody.toString("utf8");
        // 把post请求的查询字符串，转化为一个json对象
        postBody = querystring.parse(postBody);

        // 把用户 post 提交过来的数据传递出去
        callback(postBody);
    });
}