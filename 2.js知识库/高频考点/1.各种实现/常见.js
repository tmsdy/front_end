/*

https://juejin.im/post/5d635566e51d4561e224a360

1.实现 (5).add(3).minus(2)
Number.prototype.add = function(n) {
  return this.valueOf() + n;
};
Number.prototype.minus = function(n) {
  return this.valueOf() - n;
};

*/