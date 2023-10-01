// 函数的柯理化：把一个函数拆分成多个“小”的函数，每一个函数的参数只能有一个

// 偏函数 (参数可以不是一个的柯理化函数)，我们把偏函数也称之为柯理化


// 高阶函数
// function fn(a, b, c) { // 西红柿炒鸡蛋:  西红柿，鸡蛋，糖
// }

// let fn1 = fn('鸡蛋')
// let fn2 = fn1('西红柿')  // fn1('辣椒')
// let fn3 = fn2('糖')

// let fn4 = fn('鸡蛋', '西红柿')
// let fn5 = fn4('糖')


// 判断类型 
// Object.prototype.toString.call()  
// constructor(Array,Object)
// typeof  (null) 也是一个对象  
// instanceof


// function isType(val,typing) { // 判断某个变量是不是某个类型 // [xxx Object]
//   return Object.prototype.toString.call(val).slice(8,-1) === typing
// }


// 判断某个变量是不是一个字符串
// console.log(isType('hello', 'String'))
// console.log(isType(1, 'String'))

// function isType(typing) { // 判断某个变量是不是某个类型 // [xxx Object]
//     // typing
//     return (val) => { // 定义
//         return Object.prototype.toString.call(val).slice(8,-1) === typing
//     }
// }

// 闭包: 定义的函数的作用域 和 执行函数的作用域 不是同一个就会产生闭包
// let isString = isType('String'); 
// console.log(isString(123));
// console.log(isString(123));


// 自己动手实现一个通用柯理化函数

// 通过高阶函数可以缓存变量
function sum(a, b, c) { // [1,2,3]
  return a+b+c
}

// 柯理化函数一定是高阶函数
function curry(func) { 
  const curried = (...args) => { // 用户本次执行的时候传递的参数
		if (args.length < func.length) {
      return (...others) => curried(...args,...others)
    } else {
      return func(...args)
    }
  }
  return curried
}

let curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3))

// 判断某个变量是不是某个类型 // [xxx Object]
function isType(typing,val) { 
  return Object.prototype.toString.call(val).slice(8,-1) === typing
}

let isString = curry(isType)('String');

console.log(isString(123));
console.log(isString('abc'));
console.log(isString(123));

