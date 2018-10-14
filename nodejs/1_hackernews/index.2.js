// 当前项目（包都入口文件）

// 封装一个 render（）函数
// 将 render 函数挂在到 res 对象上，可以通过res。render（）来访问

// 1.加载 http 模块
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

// 2.创建服务
http.createServer(function (req, res) {
    // 要在这里写大量的代码

    // 为 res 对象添加一个 render 函数方便后续使用
    res.render = function (filename) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                res.writeHead(404, 'Not Found', {
                    'Content-Type': 'text/html; charset=utf-8'
                });
                res.end('404, Page Not Found.');
                return;
            }
            res.setHeader('Content-Type', mime.getType(filename))
            res.end(data);
        });
    }

    // 设计路由
    // 当用户请求 / 或者 /index 的时候，显示新闻列表 -get
    // 当用户请求 /item 的时候，显示新闻详情 -get
    // 当用户请求 /submit 时，显示添加新闻页面 -get
    // 当用户请求 /add 时，将用户提交的新闻保存到 data.json 文件中 -post 

    // 将用户请求的url 和 method 转化为小写
    req.url = req.url.toLowerCase();
    req.method = req.method.toLowerCase();

    // 先根据路由将，对应的html显示出来
    if (req.url === '/' || req.url === '/index' && req.method === 'get') {
        // 1.读取 index.html 并返回
        res.render(path.join(__dirname, 'views', 'index.html'));
    } else if (req.url === '/submit' && req.method === 'get') {
        // 1.读取 submit.html 并返回
        res.render(path.join(__dirname, 'views', 'submit.html'));
    } else if (req.url === '/item' && req.method === 'get') {
        // 1. 读取 details.html 并返回
        res.render(path.join(__dirname, 'views', 'details.html'));
    } else if (req.url === '/add' && req.method === 'post') {
        // 表示 post 方法提交一条新闻

    } else if (req.url.startsWith('/resources') && req.method === 'get') {
        // 如果用户请求是以 / reqouces 开头，并且是 get 请求，就认为用户是要请球静态资源
        res.render(path.join(__dirname, req.url));
    } else {
        res.writeHead(404, 'Not Found', {
            'Content-Type': 'text/html; charset=utf-8'
        });
        res.end('404, Page Not Found.');
    }
}).listen(9090, function () {
    console.log('http://localhost:9090');
})