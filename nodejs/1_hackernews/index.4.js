// 当前项目（包都入口文件）

// 封装一个 render（）函数
// 将 render 函数挂在到 res 对象上，可以通过res。render（）来访问
// 实现 get 方式添加新闻
// 实现在原来 list 数组的基础上追加新闻，而不是覆盖

// 1.加载 http 模块
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const url = require('url');

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

    // 通过 url 模块调用 url.parse（）方法解析用户请求得url(req.url)
    let urlObj = url.parse(req.url, true);
    // console.log(urlObj);

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
    } else if (req.url.startsWith('/add') && req.method === 'get') {
        // 表示 get 方法提交一条新闻
        // 要获取用户 get 提交过来的数据，需要用到 url 模块，（这个模块的node.js内部模块，不是第三方模块）
        // 既然是 get提交数据，所以通过 req.url 就可以直接获取这些数据，但是这样使用起来不方便（得自己去截取字符串，然后获取想要得数据）
        // 通过 url 模块，可以将用户 get 体检得数据解析成一个 json 对象，使用起来很不方便
        // 1.获取用户 get 提交过来的数据
        // urlObj.query.title
        // urlObj.query.url
        // urlObj.query.text
        // 1.1 读取data.json 文件中的数据，并将读取到的数据转换为数组
        // 读取文件的时候可以直接写 utf8 这样回调函数中的 data 就是一个字符串
        fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
            // 因为第一次访问网站，data.json 文件本身不存在，所以肯定是错误
            // 这种错误不是网站错误不用抛出异常
            if (err && err.code !== 'ENOENT') {
                throw err;
            }
            // 如果读取到了，那么就把读取到的数据 data 转化为 list数组
            // 如果没有读到，那就创建一个新的数组
            let list = JSON.parse(data || '[]');
            // 2.把用户提交过来的新闻数据保存到 data.json 文件中
            list.push(urlObj.query);
            // 把 list 数组中的数据写入到 data.json 文件中
            fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), function (err) {
                if (err) {
                    throw err;
                }
                console.log('ok');
                // 设置响应报文头，通过响应报文头告诉浏览器，执行一次页面跳转操作
                // 3.跳转到新闻页面
                res.statusCode = 302;
                res.statusMessage = 'Found';
                res.setHeader('Location', '/');
                // 结束响应
                res.end();
            });
        });

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