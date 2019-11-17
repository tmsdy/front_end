let res = Object.keys({ //把key值拿出来放到一个数组中
    "babel-preset-stage-1": "^6.24.1",
    "vue": "^2.5.17",
    "vue-router": "^3.0.2",
    "vue-style-loader": "^4.1.2",
    "vuex": "^3.0.1"
})

console.log(res) // ["babel-preset-stage-1", "vue", "vue-router", "vue-style-loader", "vuex"]

var obj = {
    '0':'a',
    '2':'b',
    '1':'c'
};

Object.keys(obj).forEach(function(key){

     console.log(key,obj[key]);

});
console.log(Object.keys(obj).sort((a,b)=>Number(a)-Number(b)))