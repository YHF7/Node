/*
 * @Author: yhf 
 * @Date: 2018-09-27 21:08:47 
 * @Last Modified by: yhf
 * @Last Modified time: 2018-09-28 17:40:23
 */
var path = require('path');


module.exports = {
  "port": 9090,
  "dataPath": path.join(__dirname, 'data', 'data.json'),
  "viewPath": path.join(__dirname, 'views')
};