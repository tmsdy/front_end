
cc.Class({
    extends: cc.Component,

    properties: {
       accl: 1,//飞机速度
       plane:{
        default:null,
        type:cc.Node
       }
    },
    setInputControl:function(){
        var self = this;
        var listener = {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:function(keyCode,event){
                switch(keyCode){
                    case 65: 
                        self.accLeft = true;
                        break;
                    case 68: 
                        self.accRight = true;
                        break;
                    case 87: 
                        self.accUp = true;
                        break;
                    case 83: 
                        self.accDown = true;
                        break;
                }
            },
            onKeyReleased:function(keyCode,event){
                switch(keyCode){
                    case 65: 
                        self.accLeft = false;
                        break;
                    case 68: 
                        self.accRight = false;
                        break;
                    case 87: 
                        self.accUp = false;
                        break;
                    case 83: 
                        self.accDown = false;
                        break;
                }
            }
        }
        cc.eventManager.addListener(listener,self.node) //这个有点老旧了
    },
    onLoad () {
        this.accLeft = false;
        this.accRight = false;
        this.accUp = false;
        this.accDown = false;
        this.setInputControl()
    },

    update (dt) {
        
        if(this.accLeft){
            this.plane.x -= this.accl
        }
        if(this.accRight){
            this.plane.x += this.accl
        }
        if(this.accUp){
            this.plane.y += this.accl
        }
        if(this.accDown){
            this.plane.y -= this.accl
        }
    },
});
