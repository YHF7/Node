// 当前项目（包都入口文件）

// 封装一个 render（）函数
// 将 render 函数挂在到 res 对象上，可以通过res。render（）来访问
// 实现 get 方式添加新闻
// 实现在原来 list 数组的基础上追加新闻，而不是覆盖
// 实现 post 的方式提交新闻
// 实现首页显示新闻
// 实现显示新闻详情
// 封装 读取 data.json 文件 和 写入 data.json 文件的方法


// 1.加载 http 模块
const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const url = require("url");
const querystring = require("querystring");
const _ = require('underscore');



// 2.创建服务
http.createServer(function (req, res) {
  // 要在这里写大量的代码



  // 为 res 对象添加一个 render 函数方便后续使用
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


  // 将用户请求的url 和 method 转化为小写
  req.url = req.url.toLowerCase();
  req.method = req.method.toLowerCase();



  // 通过 url 模块调用 url.parse（）方法解析用户请求得url(req.url)
  let urlObj = url.parse(req.url, true);



  // 先根据路由将，对应的html显示出来
  if (req.url === "/" || (req.url === "/index" && req.method === "get")) {
    // 1.调用readNewsData函数读取 data.json 文件中的数据 并将读取到的数据 转化为list 数组 返回过来
    readNewsData(function (list) {
      // 因为现在要渲染的index.html 中需要用到模板数据，所以render 函数添加第二个参数
      // 第二个参数的作用就是用来传递 html 中要使用的模板数据
      res.render(path.join(__dirname, 'views', 'index.html'), {
        list: list
      });
    });


  } else if (req.url === "/submit" && req.method === "get") {
    // 1.读取 submit.html 并返回
    res.render(path.join(__dirname, "views", "submit.html"));
  } else if (urlObj.pathname === '/item' && req.method === 'get') {
    // 1. 获取当前用户请求的新闻的 id
    // urlObj.query.id 
    // 2. 读取 data.json 文件中的数据，根据 id 找到对应新闻

    readNewsData(function (list_news) {
      var model = null;

      // 循环 list_news 中的数据，找到和 id 值相等的数据
      for (var i = 0; i < list_news.length; i++) {

        // 判断集合中是否有与用户提交的 id 相等的新闻
        if (list_news[i].id.toString() === urlObj.query.id) {
          // 如果找到了相等的新闻，则将其记录下来
          model = list_news[i];
          break;
        }
      }

      if (model) {
        // 3. 调用 res.render() 函数进行模板引擎的渲染
        res.render(path.join(__dirname, 'views', 'details.html'), {
          item: model
        });
      } else {
        res.end('No Such Item');
      }
    });

  } else if (req.url.startsWith("/add") && req.method === "get") {
    // 1.读取data.json文件内容
    readNewsData(function (list) {
      // 2.
      // 把新闻 添加到 list 之前，为新闻添加一个id
      urlObj.query.id = list.length;
      // 把用户提交过来的新闻数据保存到 data.json 文件中
      list.push(urlObj.query);
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
  } else if (req.url === "/add" && req.method === "post") {
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

  } else if (req.url.startsWith("/resources") && req.method === "get") {
    // 如果用户请求是以 / reqouces 开头，并且是 get 请求，就认为用户是要请球静态资源
    res.render(path.join(__dirname, req.url));
  } else {
    res.writeHead(404, "Not Found", {
      "Content-Type": "text/html; charset=utf-8"
    });
    res.end("404, Page Not Found.");
  }
}).listen(9090, function () {
  console.log("http://localhost:9090");
});


// 封装一个读取文件的函数
function readNewsData(callback) {
  fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
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