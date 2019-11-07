
cc.Class({
    extends: cc.Component,

    properties: {
        money:{
            default:null,
            type:cc.Prefab,//预制资源
        }
    },
    newMoney:function(){ //生成一个新红包
        var newMoney = cc.instantiate(this.money);//复制资源
        this.node.addChild(newMoney,100) //加入canvas并设100层级
        newMoney.setPosition(this.getNewStartPosition())
        console.log(this.node.height)
        // var moveTo = cc.moveTo(1,cc.v2(newMoney.getPosition().x,-this.node.height/2-50))
        var moveTo = cc.moveTo(1,cc.v2(newMoney.getPosition().x,-440))
        var finish = cc.callFunc(newMoney.removeFromParent,newMoney)//落完移除
        var myAction = cc.sequence(moveTo,finish)
        newMoney.runAction(myAction)
    },
    getNewStartPosition:function(){
        var randX = Math.random()*500-250; //randX -250到250区域
        // var randY = this.node.height/2+100;//稍微超出屏幕一点
        var randY = 500;
        console.log(randX,randY)
        return cc.v2(randX,randY)
    },
    onLoad () {
        this.schedule(function(){
            this.newMoney()
        },1)
    },

    start () {

    },

    // update (dt) {},
});
