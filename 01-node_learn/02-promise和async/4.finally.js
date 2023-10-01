// 无论成功和失败都要执行的逻辑
Promise.prototype.finally = function (fn) {
  return this.then(
    (val) => {
      // Promise.resolve 具备一个功能，就是可以解析传入的promise
      return Promise.resolve(fn()).then(() => val);
    },
    (r) => {
      return Promise.resolve(fn()).then(() => {
        throw r;
      });
    }
  );
};


// promise解析过程 一个promise 返回一个promise才会有等待效果，
// 会采用返回的promise的状态作为下一次then的结果
Promise.resolve("abc")
  .finally(() => {
    // 无论成功还是失败都会执行
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("abcasdasda");
      }, 1000);
    });
  })
  .then((value) => {
    console.log("成功", value);
  })
  .catch((value) => {
    console.log("失败", value);
  });
