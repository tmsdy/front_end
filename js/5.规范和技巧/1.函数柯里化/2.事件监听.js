
function nodeListen(node, eventName){
    return function(fn){
        node.addEventListener(eventName, function(){
            fn.apply(this, Array.prototype.slice.call(arguments));
        }, false);
    }
}

var bodyClickListen = nodeListen(document.body, 'click');

bodyClickListen(function(){
    console.log('first listen');
});

bodyClickListen(function(){
    console.log('second listen');
});

