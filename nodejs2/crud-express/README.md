# Express - crud

## 起步

- 初始化
- 模板处理
- 案例说明

## 路由设计

| 请求方法 |     请求路径     | get 参数 |           post 参数            |       备注       |
|----------|------------------|----------|--------------------------------|------------------|
| GET      | /studens         |          |                                | 渲染首页         |
| GET      | /students/new    |          |                                | 渲染添加学生页面 |
| POST     | /studens/new     |          | name、age、gender、hobbies     | 处理添加学生请求 |
| GET      | /students/edit   | id       |                                | 渲染编辑页面     |
| POST     | /studens/edit    |          | id、name、age、gender、hobbies | 处理编辑请求     |
| GET      | /students/delete | id       |                                | 处理删除请求     |
|          |                  |          |                                |                  |

## 案例说明
- 1.页面的数据
    + 用 db.json 装数据
    + 挂载路由
    + app.get app.post 路由
    + app.listen 开启服务端口
    + node_modules \ public 页面数据共享
- 2.页面显示
    + router.js 和 students.js 控制路由与业务逻辑(模块化)
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
    + [项目地址](https://github.com/YHF7/mypro/tree/master/nodejs2/crud-express)
- 6.开发配置
    + mac os 10.13.3
    + npm 6.4.1
    + node 10.10.0
    + Bootstrap v3
- 7.案例查看/使用
    + sudo git clone https://github.com/YHF7/mypro.git
    + cd mypro/nodejs2/crud-express/
    + node app.js