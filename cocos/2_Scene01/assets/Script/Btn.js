
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        console.log(123)
        this.node.on('mousedown',function(){
            console.log('mousedown')
            cc.director.loadScene('Scene02') ;
        })
    },

    start () {

    },

    // update (dt) {},
});
