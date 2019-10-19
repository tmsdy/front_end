var str = 'assssjdssskssalsssdkjsssdss';

var arr = str.split('');

str = arr.sort().join('');
var value = '';
var index = 0;

var re = /(\w)\1+/g; //匹配字符出现一次以上

str.replace(re, function ($0, $1) {
    console.log($0);
    if (index < $0.length) { //只有比上一个匹配的更长的才能进if
        index = $0.length;
        value = $1;
    }

});

console.log('最多的字符:' + value + ',重复的次数:' + index);