const a = require('./01-module-a');
console.log('b内使用了--', a);
module.exports = '我是module b'