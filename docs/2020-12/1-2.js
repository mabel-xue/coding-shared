function a() {
  name='rick'
}
function b() {
  name='morty'
}

console.log(a);
console.log(a.prototype);
console.log(a.__proto__);

// const c = Function.prototype.bind(b)
// console.log('c: ', c.name);
// console.log('c: ', c.prototype);

console.log(Object.getPrototypeOf(a.prototype));