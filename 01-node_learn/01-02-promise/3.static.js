// ECMAScript 为了更方便还提供了更好的方法
// Promise.all 等待所有的promise都成功才成功，有一个失败就失败了
const path = require("path");
const fs = require("fs");
function readFile(url) {
  return new Promise((resolve, reject) => {
    fs.readFile(url, "utf-8", function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

// 1 Promise.all使用方法
// Promise.all([
//   readFile(path.resolve(__dirname, 'name.txt')),
//   readFile(path.resolve(__dirname, 'age.txt')),
//   'my100'
// ]).then(data => {
//     console.log(data)
// }).catch(err => {
//     console.log(err)
// })

// 2 Promise.race使用方法==> 哪个结果快就用谁的, 用它来终端成功的结果
// Promise.race([
//     readFile(path.resolve(__dirname, 'name.txt')),
//     readFile(path.resolve(__dirname, 'age.txt')),
// ]).then(data => {
//     console.log(data,'success')
// }).catch(err => {
//     console.log(err,'error')
// })

// 使用场景: 超时处理==> 可以自己构建一个promise，和用户写的放在一起
//                     如果我想让用户的失败，我就让内置的promise失败就可以了

let abort;
function withAbort(userPromise) {
  let abort;
  const internalPromise = new Promise((resolve, reject) => {
    abort = reject;
  });
  let p = Promise.race([userPromise, internalPromise]);
  p.abort = abort;
  return p;
}

let p = new Promise((resolve, reject) => {
  // abort = reject;
  setTimeout(() => {
    resolve(100);
  }, 3000);
});

p = withAbort(p);

setTimeout(() => {
  p.abort("超时了");
}, 2000);

p.then((data) => {
  console.log(data);
}).catch((err) => {
  // 让这个promise 走向失败
  console.log(err, "error");
});



// Promise.allSettled([
//   readFile(path.resolve(__dirname, "name1.txt")),
//   readFile(path.resolve(__dirname, "age.txt")),
// ])
//   .then((data) => {
//     console.log(data, "success");
//   })
//   .catch((err) => {
//     console.log(err, "error");
//   });
