const a = require('./03-1-cic-a');
const b = require('./03-2-cic-b');

a.saveModule(b);
b.saveModule(a);

// 在a中使用b的方法
a.fn(); //a使用了b
b.fn(); //b使用了a


// 相对路径会先找文件，再去找文件夹 
console.log(require('./04-a')); 