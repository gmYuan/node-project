
const fs = require('fs'); // file system
const path = require('path');

let person = {}
// let i = 0;
// function out() {
//     if (++i == 2) {
//         console.log(person)
//     }
// }

function after(times, callback) { // 高阶函数来处理异步问题
  return function () { // out
    if (--times == 0) {
      callback()
    }
  }
}

// 只能等待两次都完成后才执行，过程丢失了....
let out = after(2, function () {
  console.log(person)
})

// 发布订阅模式
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
  person.name = data
  out(); // 发布
});

fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
  person.age = data
  out(); // 发布
});


// 同步多个异步操作的返回值结果 （Promise.all）