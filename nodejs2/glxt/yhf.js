/*
 * @Author: yhf 
 * @Date: 2018-10-04 15:29:50 
 * @Last Modified by: yhf
 * @Last Modified time: 2018-10-04 16:36:40
 */

/**
 * yhf.js
 * 数据操作文件模块
 * 职责：操作文件中的数据，只处理数据，不关心业务
 *
 * 链接数据库
 */
// 1. 引包
const mongoose = require('mongoose');
// 存储操作
const Schema = mongoose.Schema;
// 2. 配置
// 连接数据库
mongoose.connect('mongodb://localhost/yhfglxt', {
    useNewUrlParser: true
});

// 3. 模型架构
var yhfxt = new Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    age: {
        type: Number
    },
    hobbies: {
        type: String
    },
    admin: {
        type: String,
        required: true
    }
})

// 4.直接导出模型构造函数
module.exports = mongoose.model('Yhf', yhfxt);