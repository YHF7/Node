/*
 * @Author: yhf 
 * @Date: 2018-10-04 13:15:37 
 * @Last Modified by: yhf
 * @Last Modified time: 2018-10-04 17:25:23
 */

/**
 * router.js 路由模块
 * 职责：
 *   处理路由
 *   根据不同的请求方法+请求路径设置具体的请求处理函数
 * 模块职责要单一，不要乱写
 * 我们划分模块的目的就是为了增强项目代码的可维护性
 * 提升开发效率
 */

// 引入数据库链接操作文件
let Yhf = require('./yhf');

// Express 提供了一种更好的方式
// 专门用来包装路由的
const express = require('express');
// 公共页 处理服务端口等
const public = require('./public');


// 1. 创建一个路由容器
let router = express.Router();

// 2. 把路由都挂载到 router 路由容器中

// 主页--------------------------------------------------------start>
router.get('/yhf', function (req, res) {
    Yhf.find(function (err, yhf) {
        if (err) {
            return res.status(500).send('Server error.');
        }
        res.render('index.html', {
            yhf: yhf,
            index: {
                name: public.name
            }
        });
    });
});
// 主页--------------------------------------------------------end>

// 添加成员--------------------------------------------------------start>
// 渲染添加成员页面
router.get('/yhf/new', function (req, res) {
    res.render('new.html', {
        index: {
            name: public.name
        }
    });
});

// 添加成员处理
router.post('/yhf/new', function (req, res) {
    // 1. 获取表单数据
    // 2. 处理
    //    将数据保存到 db.json 文件中用以持久化
    // 3. 发送响应

    // 获取表单数据
    let data = req.body;
    // 一开始都是普通会员
    data.admin = '普通会员';
    // 连接处理数据库添加数据
    new Yhf(data).save(function (err) {
        if (err) {
            return res.status(500).send('Server error.');
        }
        // 重定向到主页
        res.redirect('/yhf');
    })
})
// 添加成员--------------------------------------------------------end>


// 修改成员信息--------------------------------------------------------start>
// 渲染修改成员信息页面
router.get('/yhf/edit', function (req, res) {
    // 1. 在客户端的列表页中处理链接问题（需要有 id 参数）
    // 2. 获取要编辑的学生 id
    // 
    // 3. 渲染编辑页面
    //    根据 id 把学生信息查出来
    //    使用模板引擎渲染页面

    Yhf.findById(req.query.id.replace(/"/g, ''), function (err, yhf) {
        // 1. 获取表单数据
        //    req.body
        // 2. 更新
        //    Student.updateById()
        // 3. 发送响应

        if (err) {
            console.log(err);
            return res.status(500).send('Server error.');
        }
        res.render('edit.html', {
            yhf: yhf,
            index: {
                name: public.name
            }
        });
    })
});

// 更新成员信息处理
router.post('/yhf/edit', function (req, res) {
    Yhf.findByIdAndUpdate(req.body.id.replace(/"/g, ''), req.body, function (err) {
        if (err) {
            return res.status(500).send('Server error.');
        }
        res.redirect('/yhf');
    });
});
// 修改成员信息--------------------------------------------------------end>

// 删除成员--------------------------------------------------------start>
// 删除成员处理
router.get('/yhf/delete', function (req, res) {
    // 1. 获取要删除的 id
    // 2. 根据 id 执行删除操作
    // 3. 根据操作结果发送响应数据
    Yhf.findByIdAndRemove(req.query.id.replace(/"/g, ''), function (err) {
        if (err) {
            return res.status(500).send('Server error.');
        }
        res.redirect('/yhf');
    });
});
// 删除成员--------------------------------------------------------end>

// 3. 把 router 导出
module.exports = router;