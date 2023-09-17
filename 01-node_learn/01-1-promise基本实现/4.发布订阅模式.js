const fs = require('fs');
const path = require('path');
let person = {};

let event = {
  _arr:[],
  // 把函数存起来
  on(callback) {
    this._arr.push(callback)
  }, 

  // 发布就是将函数拿出来一个个执行
  emit(...args){ 
    this._arr.forEach(fn => fn(...args))
  } 
}

// 订阅
event.on(function (key,data) {
    // 每次读取成功后我就打印消息 
    person[key] = data
    console.log('读取成功一次',key)
})
event.on(function () {
  if (Object.keys(person).length === 2) {
    console.log('当前已经读取完毕了',person)
  }
})


fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function (err, data) {
  event.emit('name',data) 
});
fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
  event.emit('age',data)
});


// a.txt (b.txt) -> b.txt(c.txt)
// fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
//     if(err){}
//     fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
//         if(err){}
//         fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
//             if(err){}
//             fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
//                 if(err){}
//                 fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function (err, data) {
//                     if(err){}
//                     event.emit('age',data)
//                   });
//               });
//           });
//       });
//   });
//   promise.then().then().then().catch()
//   Promise.all 可以直接支持多个异步请求 同时拿到返回结果