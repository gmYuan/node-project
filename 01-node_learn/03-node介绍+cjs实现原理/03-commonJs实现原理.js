const path = require("path");
const fs = require("fs");
const vm = require("vm");

// 采用vscode来进行调试

// common.js规范实现大致流程：
// 1.调用的是require方法
// 2.加载模块 Module._load
// 3.通过Module._resolveFilename: 核心是 帮我们转成绝对路径 + 给我路径添加后缀
// 4.如果这个文件被加载过，走缓存，否则再去加载模块

// 5.加载模块: 
//   - 核心是创建一个模块的实例: new Module() -> {id:文件,exports: 模块导出结果 }
//   - 6.将模块缓存起来
//   - 7.加载文件, 要看加载文件的扩展名是什么: .js / .json
//   - 8.根据扩展名，找到对应的加载方案/策略==> 加载js的策略
//   - 9. js的加载就是读取文件内容
//   - 10.给内容包装一个函数，让这个函数执行(代码里面肯定会给module.exports 赋值)

// 11. require方法 最终返回的是module.exports
//     用户只要将结果放到module.exports上就可以获取到了


function req(id) {
  const filename = Module._resolveFilename(id);
  let existsModule = Module._cache[filename];
  if (existsModule) {
    // 说明模块加载过
    return existsModule.exports;
  }
	// 这个对象里最重要的就是exports对象
  const module = new Module(filename); 
  Module._cache[filename] = module; // 加载过，就缓存起来
  module.load();
  return module.exports; // 导出这个对象
}

// require拿到的是 module.exports的结果
let a = req("./a.js"); 
console.log(a);

// 如果是 引用对象里面的内容变化了, 重新require可以拿到最新的
// let exports = module.exports = {}
// ✅ => exports.a = 100;
// ❌ => exports = { a: 1 }:
//   用户不能直接改变exports的引用，因为不会导致module.exports的变化

// 导出的方式: this.xxx/ exports.xxx/ module.exports.xxx/  module.exports默认导出
// commonjs中如果有默认导出，那么属性导出是无效的


function Module(id) {
  this.id = id;
  this.exports = {};
}

Module._resolveFilename = function (id) {
  const filename = path.resolve(__dirname, id);
  if (fs.existsSync(filename)) {
    return filename;
  }
  const keys = Object.keys(Module._extensions);
  for (let i = 0; i < keys.length; i++) {
    // 尝试添加后缀
    const ext = keys[i];
    const filename = path.resolve(__dirname, id + ext);
    if (fs.existsSync(filename)) {
      return filename;
    }
  }
  throw new Error("cannot found module");
};

Module._cache = {};

Module.prototype.load = function () {
  let ext = path.extname(this.id);
  Module._extensions[ext](this);
};


Module._extensions = {
  ".js"(module) {
    const content = fs.readFileSync(module.id, "utf8");
    const fn = vm.compileFunction(content, [
      "exports",
      "require",
      "module",
      "__filename",
      "__dirname",
    ]);
		
		// this 和 module.exports 也是同一个值，可以互相调用
    const exports = module.exports;
    let thisValue = exports;
    let require = req;
    let filename = module.id;
    let dirname = path.dirname(filename);
    console.log(fn.toString());
		// fn.apply(this)==> 让函数执行  module.exports = 'hello'
    Reflect.apply(fn, thisValue, [exports, require, module, filename, dirname]);
  },

  ".json"(module) {
    const content = fs.readFileSync(module.id, "utf8");
    module.exports = JSON.parse(content);
  },
};





