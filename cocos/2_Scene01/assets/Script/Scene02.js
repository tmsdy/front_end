
cc.Class({
    extends: cc.Component,

    properties: {
       timeLabel:{
           default:null ,
           type: cc.Label
       }
    },

    onLoad () {
        var timeIn = 5
        this.schedule(function(){ //定时器
            timeIn--;
            this.timeLabel.string = timeIn
            if(timeIn===0){
                cc.director.loadScene('Scene03')
            }
        },1)
    },

    start () {

    },

    // update (dt) {},
});
