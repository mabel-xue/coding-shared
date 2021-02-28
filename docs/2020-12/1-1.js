class A {
  name = 'rick';
  say() {
    console.log('dub bla');
  }
}
// console.log(A.prototype);
// const a1 = new A();
// console.log('a1: ', a1);
// a1.say()

class B extends A {
  name = 'b';
  say() {
    console.log('fake dub 1');
  }
}

class C extends A {
  name = 'c';
  say() {
    console.log('fake dub 2');
  }
}

console.log(B.prototype.say);
const b1 = new B();
console.log('b1: ', b1);
b1.__proto__ = new C(); 
Object.setPrototypeOf(b1, new C()); // 官方不推荐直接修改__proto__，用setPrototypeOf实现
console.log('b1: ',  b1);
console.log(b1.name);
b1.say()

// 文档 MDN-setPrototypeOf https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf

