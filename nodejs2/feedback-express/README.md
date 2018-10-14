# 案例说明


## 案例说明
- 1.页面的数据
    + 未链接数据库所以，用comments数组代替
    + app.get app.post 路由
    + app.listen 开启服务端口
- 2.页面显示
    + Express 为 Response 相应对象提供了一个方法：render
    + render 方法默认是不可以使用，但是如果配置了模板引擎就可以使用了
    + res.render('html模板名', {模板数据})
    + 第一个参数不能写路径，默认会去项目中的 views 目录查找该模板文件
    + 也就是说 Express 有一个约定：开发人员把所有的视图文件都放到 views 目录中
    + express 模版引擎 express-art-template使用 res.render('文件名， {模板对象})
- 3.数据传输
    + body-parser 中间件 解析表单 POST 请求体 req.body 得到数据
- 4.使用的外部插件
    + express
    + express-art-template
    + body-parse
- 5.项目地址
    + [项目地址](https://github.com/YHF7/mypro/tree/master/nodejs2/feedback-express)
- 6.开发配置
    + mac os 10.13.3
    + npm 6.4.1
    + node 10.10.0
    + Bootstrap v3
- 7.案例查看/使用
    + sudo git clone https://github.com/YHF7/mypro.git
    + cd mypro/nodejs2/feedback-express/
    + node app.js
- 8.具体功能
    + 增加数据
    + 查看数据


# 使用的外部插件
## express 前端开发框架
1.安装
`
npm init -y //添加json初始化文件
npm install express --save//安装express
`
2.引包
`
const express = require('express');
`
3.创建服务
`
const app = express();
`
4.使用
`
app.get('/', function (req, res) {
  req.send('index.html')
})
`
## art-template 模版引擎 (配置在express中)
### 安装使用
1.安装
`
npm install --save art-template//express-art-templat依赖了art-template所以可以不用记载但是要安装
npm install --save express-art-template
`
2.配置
`
app.engine('art',require('express-art-template'))//art 可以替换成其他的标示 html 等
`
3.使用
`
app.get('/',function (req,res) {
    // 在 Express 中使用模板引擎有更好的方式：res.render('文件名， {模板对象})
  // 可以自己尝试去看 art-template 官方文档：如何让 art-template 结合 Express 来使用
    res.render('index.html',{
        title: 'hello world'
    });
});
`
4.如果希望修改默认的 views 视图渲染存储目录， 可以如下修改
`
// 第一个参数 views 不能写错
app.set('views', 目录路径)
`
## body-parser 中间件(解析表单 post 请求体)

1.安装
npm install --save body-parser
2.引包
`
const bodyParser = require('body-parser);
`
3.配置
`
// parse application/x-www-form-urlencoded 解析application
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json 解析
app.use(bodyParser.json());
`
4.使用
`
app.post('/post',function (req,res) {
    var myDate = new Date();
    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var date = myDate.getDate(); //获取当前日(1-31)
    let comment = req.body;
    comment.dateTime = year + "-" + month + "-" + date;
    comments.unshift(comment);
    res.redirect('/');
})
`