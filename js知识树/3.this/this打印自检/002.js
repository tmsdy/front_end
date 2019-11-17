var length = 10;
function fn() {
 console.log(this.length);
}

const obj = {
    length: 5,
    method: function(fn) {
        console.log(this.length)
        fn();
        arguments[0]();
    }
};

obj.method(fn, 1);