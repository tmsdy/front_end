function sum(...args) {
    let value = 0;

    function innerSum(...args) {
        value = args.reduce((a, c) => (a += c), value);
        return innerSum;
    }

    innerSum.valueOf = function () {
        return value;
    };

    return innerSum(...args);
}
console.log(sum(1))
console.log(sum(1)(2))
console.log(sum(1)(2, 3, 4)(5))
