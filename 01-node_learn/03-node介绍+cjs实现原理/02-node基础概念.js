// Node概念: runtime 运行时， 可以让我们的js运行在服务端 （底层用的是v8引擎构建的）
// Node的特点: 非阻塞i/o (异步的非阻塞) +  事件驱动(支持js语法，不支持bom和dom + 内置模块)
// Node = js + 内置模块 + 第三方模块

// 异步 + 非阻塞 
// 同步 + 阻塞(node中实现的api 都支持异步，底层采用的是多线程模型)
// 异步阻塞（没有意义） 同步非阻塞


// 线程池的概念 默认创建10个线程 
// 多线程: 可以同时执行多个任务, 给每个请求分配一个线程
// - 优点:可以并行
// - 缺点1: 浪费资源 ==> 适合cpu密集型（压缩、加密）
// - 缺点2: 线程间的通信比较麻烦， 多个线程如果冲突了==> 锁，开辟内存来管理线程

// 单线程: 只有一个，节约内存==> 不适合 cpu密集型的操作，适合i/o密集型, 缺点是容易阻塞
// nginx

// 事件驱动: 按照事件的顺序 来触发处理逻辑(事件环) 
//          读写操作完成后 会放到对应的队列中, 等待事件环 来触发对应的事件


// Node适合做什么:
//   - 编写前端工具 工具链: vite/ rollup/ webpack/ gulp/ 脚手架
//   - 为前端服务的后端: 中间层bff(格式化/ 云服务/ 处理跨域/ 代理)
//   - 创建服务器: koa/ express/ eggjs/ nestjs 可以用来开发服务器
//   - 聊天: socket.io/ 即时通讯/ 爬虫/ ssr都可以在node中去实现


// 前端模块化
// 前端最早没有模块化的概念（seajs/ requirejs)==> node中自己实现了一套模块化规范
// 前端比较主流的模块化规范: esmodule +  nodejs支持commonjs -> esModule

// 模块化规范解决了哪些问题:
//   - 命名冲突，代码隔离上的问题 + 方便代码的复用，提升代码的可扩展性
//   - 按照每个文件来划分模块，一个文件就是一个独立的模块 (在每个文件的外面都包装了一个函数)


// commonjs规范:
// 规范的目的就是: 定义如何 导出一个模块 + 别人引用我, 做到多个文件之间 共享逻辑的处理

// 实现原则:
// 1. 每个js文件都是一个模块
// 2. 如果你想给别人用自己的逻辑==> module.exports导出 
// 3. 别人想使用我，采用require语法来使用==> require('xxx')

// 如果不带路径会被识别成原生模块或者第三方模块
// 内部会自动帮我们添加 .js后缀/ .json后缀

// 使用方法示例: 

// S1 同步导入模块
const r = `function () {
    module.exports = 'hello'
    return module.exports
}`

// S2 读取文件==>  path(采用的是绝对路径)
const path = require('path');
const fs  = require('fs')

//S2.1  __filename 和 __dirname的区别
console.log(path.join(__dirname,'a','b','/')) // 只是拼接

// resolve会解析出一个绝对路径: 注意resolve会以【当前执行路径】作为解析路径
console.log(path.resolve('a', 'b','/a')); 

// join !== resolve 
// 在一定的场景下join和resolve没有区别 && 遇到/的时候只能用join, 不能用resolve

// S2.2 获取扩展名
console.log(path.extname('a.min.js')); 

// 读取文件文件不存在会发生异常
const result = fs.readFileSync(path.resolve(__dirname, 'test1.md'), 'utf8')
console.log(fs.existsSync(path.resolve(__dirname, 'test1.md')))

//S3 字符串转化为函数的方法
// eval            隔离效果，性能差
// new Function
const vm = require('vm');
vm.runInThisContext('console.log(a)'); // 沙箱就是一个干净的不受外界影响的盒子
