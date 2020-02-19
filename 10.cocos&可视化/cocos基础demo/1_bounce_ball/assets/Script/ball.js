// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bounceDuration:0.5,
        bounceHeight:200
    },
    ballBounceAction: function(){
        var bounceUp = cc.moveBy(this.bounceDuration,cc.p(0,this.bounceHeight)).easing(cc.easeCubicActionOut())
        var bounceDown = cc.moveBy(this.bounceDuration,cc.p(0,-this.bounceHeight)).easing(cc.easeCubicActionIn())
        return cc.repeatForever(cc.sequence(bounceUp,bounceDown))
    },

    onLoad () {
        this.node.runAction(this.ballBounceAction())
    },

    start () {

    },

    // update (dt) {},
});
