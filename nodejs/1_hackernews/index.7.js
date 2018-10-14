// 当前项目（包都入口文件）

// 封装一个 render（）函数
// 将 render 函数挂在到 res 对象上，可以通过res。render（）来访问
// 实现 get 方式添加新闻
// 实现在原来 list 数组的基础上追加新闻，而不是覆盖
// 实现 post 的方式提交新闻
// 实现首页显示新闻
// 实现显示新闻详情



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
      // 1.读取 data.json 文件中的数据 并将读取到的数据 转化为list 数组
      // 因为现在要渲染的index。html 中需要用到模板数据，所以render 函数添加第二个参数
      // 第二个参数的作用就是用来传递 html 中要使用的模板数据
      fs.readFile(path.join(__dirname, "data", "data.json"), "utf8", function (
        err,
        data
      ) {
        // 因为第一次访问网站，data.json 文件本身不存在，所以肯定是错误
        // 这种错误不是网站错误不用抛出异常
        if (err && err.code !== "ENOENT") {
          throw err;
        }
        // 如果读取到了，那么就把读取到的数据 data 转化为 list数组
        // 如果没有读到，那就创建一个新的数组
        let list_news = JSON.parse(data || "[]");

        // 2.在服务器端使用模版引擎，将 list 中的数据和index。html文件中的内容结合 渲染
        res.render(path.join(__dirname, 'views', 'index.html'), {
          list: list_news
        });

      });
    } else if (req.url === "/submit" && req.method === "get") {
      // 1.读取 submit.html 并返回
      res.render(path.join(__dirname, "views", "submit.html"));
    } else if (urlObj.pathname === '/item' && req.method === 'get') {
      // 1. 获取当前用户请求的新闻的 id
      // urlObj.query.id 
      // 2. 读取 data.json 文件中的数据，根据 id 找到对应新闻
      fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
        if (err && err.code !== 'ENOENT') {
          throw err;
        }
        // 读取到的新闻数据
        var list_news = JSON.parse(data || '[]');
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
      // 1.1 读取data.json 文件中的数据，并将读取到的数据转换为数组
      fs.readFile(path.join(__dirname, "data", "data.json"), "utf8", function (
        err,
        data
      ) {
        // 因为第一次访问网站，data.json 文件本身不存在，所以肯定是错误
        // 这种错误不是网站错误不用抛出异常
        if (err && err.code !== "ENOENT") {
          throw err;
        }
        // 如果读取到了，那么就把读取到的数据 data 转化为 list数组
        // 如果没有读到，那就创建一个新的数组
        let list = JSON.parse(data || "[]");

        // 把新闻 添加到 list 之前，为新闻添加一个id
        urlObj.query.id = list.length;

        // 2.把用户提交过来的新闻数据保存到 data.json 文件中
        list.push(urlObj.query);
        // 把 list 数组中的数据写入到 data.json 文件中
        fs.writeFile(
          path.join(__dirname, "data", "data.json"),
          JSON.stringify(list),
          function (err) {
            if (err) {
              throw err;
            }
            // 设置响应报文头，通过响应报文头告诉浏览器，执行一次页面跳转操作
            // 3.跳转到新闻页面
            res.statusCode = 302;
            res.statusMessage = "Found";
            res.setHeader("Location", "/");
            // 结束响应
            res.end();
          }
        );
      });
    } else if (req.url === "/add" && req.method === "post") {
      // 1.读取 data.json 文件中的数据 并将读取到的数据 转化为list 数组

      // 2.在服务器端使用模版引擎，将 list 中的数据和index。html文件中的内容结合 渲染

      // 表示 post 方法提交一条新闻
      // 1.读取 data.json 文件中到数据
      fs.readFile(path.join(__dirname, "data", "data.json"), "utf8", function (
        err,
        data
      ) {
        // 因为第一次访问网站，data.json 文件本身不存在，所以肯定是错误
        // 这种错误不是网站错误不用抛出异常
        if (err && err.code !== "ENOENT") {
          throw err;
        }
        // 如果读取到了，那么就把读取到的数据 data 转化为 list数组
        // 如果没有读到，那就创建一个新的数组
        let list = JSON.parse(data || "[]");
        // 2. 获取用户 post 提交的数据
        // 因为 post 提交数据的时候，数据量可能比较大，所以会分多次进行提交，每次提交一部分数据
        // 此时要想在服务器中获取用户提交的所有数据，就必须监听 request 事件 的 data 事件（因为每次浏览器提交一部分数据到服务器就会触发一次 data 事件）
        // 那么，什么时候才表示浏览器把所有数据都提交到服务器了呢？就是当 request 对象的 end 事件被触发的时候。

        // 监听 request 的对象的 data 事件 和 end 事件代码如下：
        // 声明一个数组，用来保存用户每次提交过来的数据
        let array = [];
        req.on("data", function (chunk) {
          // 此处的 chunk 参数，就是浏览器本次提交过来的部分数据
          // chunk 的数据类型是 Buffer（Chunk就是一个Buffer对象）
          array.push(chunk);
        });
        // 监听 request 对象的 end 事件
        // 当 end 事件被触发的时候，表示上所有数据都已经提交完毕
        req.on("end", function () {
          // 在这个事件中要把array中的数据汇总起来
          // 把 array 中的每一个 Buffer 对象，集合起来转换为一个 Buffer 对象
          let postBody = Buffer.concat(array);
          // 把获取到的buffer对象转字符串
          postBody = postBody.toString("utf8");
          // 把post请求的查询字符串，转化为一个json对象
          postBody = querystring.parse(postBody);
          // 把新闻 添加到 list 之前，为新闻添加一个id
          postBody.id = list.length;
          // 将用户提交的新闻 push 到 list 中
          list.push(postBody);

          // 将新的 list 数组写入到 data.json 里面
          fs.writeFile(
            path.join(__dirname, "data", "data.json"),
            JSON.stringify(list),
            function (err) {
              if (err) {
                throw err;
              }
              // 设置响应报文头，通过响应报文头告诉浏览器，执行一次页面跳转操作
              // 3.跳转到新闻页面
              res.statusCode = 302;
              res.statusMessage = "Found";
              res.setHeader("Location", "/");
              // 结束响应
              res.end();
            }
          );
        });
      });
      // 2.将读取到的数据转化到list 数组

      // 3.向list 数组中 push 新闻

      // 4.把list 数组转化为字符串重新写入到 data.json 文件

      // 5.重定向
    } else if (req.url.startsWith("/resources") && req.method === "get") {
      // 如果用户请求是以 / reqouces 开头，并且是 get 请求，就认为用户是要请球静态资源
      res.render(path.join(__dirname, req.url));
    } else {
      res.writeHead(404, "Not Found", {
        "Content-Type": "text/html; charset=utf-8"
      });
      res.end("404, Page Not Found.");
    }
  })
  .listen(9090, function () {
    console.log("http://localhost:9090");
  });


  // 封装一个读取文件的函数
  function readNewsDAta(callback) {
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function (err, data) {
      if (err && err.code !== 'ENOENT') {
        throw err;
      }
      // 读取到的新闻数据
      var list_news = JSON.parse(data || '[]');
      // 对通过调用回到函数 callback（）将读取的数据 list 传递出去
      callback(list);
    });
  }