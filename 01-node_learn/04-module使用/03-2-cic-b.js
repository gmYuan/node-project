let moduleA;

module.exports = {
  saveModule(module) {
    moduleA = module;
  },
  use() {
    console.log("我是cic-b的内容");
  },

  fn() {
    console.log("我是cic-b模块:------------");
    moduleA.use();
  },
	
};
