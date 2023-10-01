// module.exports 的特点 就是可以导出对象，可以使用引用类型的特点 来解决这个问题

let moduleB;
module.exports = {
  saveModule(module) {
    moduleB = module;
  },
  use() {
    console.log("我是cic-a的内容");
  },
	fn() {
    console.log("我是cic-a模块:------------");
    moduleB.use(); // 在a中使用b
  },
};
