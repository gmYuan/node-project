const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
function resolvePromise(x, promise2, resolve, reject) {
  if (x === promise2) {
    return reject(
      new TypeError(
        "[TypeError: Chaining cycle detected for promise #<Promise>] error"
      )
    );
  }
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called = false;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(y, promise2, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}
class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolveCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      // 为了满足ECMAScript的功能自己额外的添加
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      if (this.status === PENDING) {
        this.value = value;
        this.status = FULFILLED;
        this.onResolveCallbacks.forEach((fn) => fn());
      }
    };
    const reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  catch(errFn) {
    return this.then(null, errFn); // 针对失败做处理，成功无视
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        process.nextTick(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            console.log(e);
            reject(e);
          }
        });
      }
      if (this.status === REJECTED) {
        process.nextTick(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(x, promise2, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === PENDING) {
        this.onResolveCallbacks.push(() => {
          process.nextTick(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(x, promise2, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          process.nextTick(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(x, promise2, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });
    return promise2;
  }
}
// 实现一个promise的延迟对象  Q.defer()
Promise.deferred = function () {
  const dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  });
};
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};

// 都成功才成功，有一个失败就失败了
Promise.all = function (values) {
  return new Promise((resolve, reject) => {
    let idx = 0;
    let result = [];
    values.forEach((item, i) => {
      Promise.resolve(item).then((val) => {
        result[i] = val; // 数组的长度不准确, 用索引映射成功的结果
        if (++idx === values.length) {
          resolve(result);
        }
      }, reject); // 如果任何一个promise失败了那么all就失败了
    });
  });
};


Promise.race = function (values) {
  return new Promise((resolve, reject) => {
    values.forEach((item, i) => {
      // 如果任何一个promise失败了那么all就失败了
      Promise.resolve(item).then(resolve, reject); 
    });
  });
};


Promise.prototype.finally = function (fn) {
  return this.then(
    (val) => {
      return Promise.resolve(fn()).then(() => val);
    },
    (r) => {
      return Promise.resolve(fn()).then(() => {
        throw r;
      });
    }
  );
};

module.exports = Promise;
