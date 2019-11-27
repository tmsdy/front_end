class Mvvm{

    constructor(options){
        this.$el = options.el ; //先挂载到实例上
        this.$data = options.data ;
        if(this.$el){
            new Compile(this.$el,this) ;
        }

    }


}