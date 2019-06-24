/*
如果 list 很大，下面的这段递归代码会造成堆栈溢出。
var list = readHugeList();
var nextListItem = function() {
    var item = list.pop();
    if (item) {
            // process the list item...
        nextListItem();
    }
};
解决方案：用setTimeout让递归函数nextListItem到下一个tick执行，避免在一个tick中递归循环造成堆栈溢出
var list = readHugeList();
var nextListItem = function() {
    var item = list.pop();
    if (item) {
        // process the list item...
        setTimeout( nextListItem, 0);
    }
};


*/