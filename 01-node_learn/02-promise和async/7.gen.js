// 实现一个简易的generator 
// generator的原理: 就是将一个函数分解成多个switch/case + 通过指针指向要执行的部分

// function* gen() {
//     let a = yield 1;
//     console.log(a)
//     let b = yield 2;
//     console.log(b)
//     let c = yield 3;
//     console.log(c)
// }


//---------------------------------------------------------

/**
执行流程：
  it = gen() ==> wrap(iterFn)==> 迭代器对象{ next: ()=>{} }
	it.next(val)==> _context.sent = val +  iterFn(_context): 更新指针

*/ 


function gen() {
  var a, b, c;
  return wrap(function gen$(_context) {
    switch ((_context.prev = _context.next)) {
      case 0:
        _context.next = 2;
        return 1;
      case 2:
        a = _context.sent;
        console.log('a是', a);
        _context.next = 6;
        return 2;
      case 6:
        b = _context.sent;
        console.log('b是', b);
        _context.next = 10;
        return 3;
      case 10:
        c = _context.sent;
				console.log('c是', c);
      case 12:
      case "end":
        return _context.stop();
    }
  });
}

function wrap(iteratorFn) {
  const _context = {
    next: 0,
    done: false,
    sent: undefined,
    stop() {
      this.done = true;
    },
  };
  return {
    next(value) {
      _context.sent = value; // 先赋值再去调用方法
      let v = iteratorFn(_context); // 执行函数传递上下文
      return { value: v, done: _context.done };
    },
  };
}


let it = gen();
console.log(it.next("000"));
console.log('--------------------------000end------')

console.log(it.next("111"));
console.log('-------------111end-------------')

console.log(it.next("222"));
console.log('------------222end--------------')

console.log(it.next("333"));



