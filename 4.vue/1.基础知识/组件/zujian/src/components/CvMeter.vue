<template>
	<div id="app" ref='app'>
	</div>
</template>

<script>
  export default {
    name: "CvMeter" ,
    props:{
      'r':{
        type:Number,
        default:100
      },
      'percent':{
        type:Number,
        default:0.6
      },
      'degree':{
        type:Number,
        default:100
      },
      'segment':{
        type:Number ,
        default:4
      },
      'start_color':{
        type:String,
        default:'#FFA933'
      },
      'end_color':{
        type:String,
        default:'#FF4B31'
      },
    },
    data(){
      return {
        val_i:0,
        ctx1:null,
        ctx2:null,
        _pos_w: 400,
        _pos_h: 300,
        _s_color:[],
        _rgb:{},
      }
    },
    created(){
    },
    mounted(){
      function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
      }
      requestAnimationFrame(animate);
      var self = this ;
      var r = self.r ;
      var start_color = self.start_color ;
      var end_color = self.end_color ;
      var percent = self.percent;
      var degree = self.degree ;
      this._initCanvas() ;
      //十六进制颜色值的正则表达式
      String.prototype.colorRgb = function(){
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = this.toLowerCase();
        if(sColor && reg.test(sColor)){
          if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
              sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
          }
          //处理六位的颜色值
          var sColorChange = [];
          for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
          }
          return "" + sColorChange.join(",") + "";
        }else{
          return sColor;
        }
      };

      var _s_color = start_color.colorRgb().split(',') ;
      var end_color = end_color.colorRgb().split(',') ;
      var const_r = 1/(percent*480)*(_s_color[0]-end_color[0]) ;
      var const_g = 1/(percent*480)*(_s_color[1]-end_color[1]) ;
      var const_b = 1/(percent*480)*(_s_color[2]-end_color[2]) ;
      self._s_color = _s_color ;
      self._rgb = {const_r, const_g, const_b};

      self.setValue(degree*percent) ;
    },
    methods:{
      _initCanvas(){

        let self = this ;
        let r = self.r ;
        let degree = self.degree ;
        let segment = self.segment ;
        let app = self.$refs.app ;
        let width = 3*r;
        let height = 2.2*r;
        let c1 = self._createCanvas(width,height) ;
        let c2 = self._createCanvas(width,height) ;
        c1.style.position = 'absolute' ;
        c1.style.zIndex = '10' ;
        c2.style.position = 'absolute' ;
        c2.style.zIndex = '100' ;
        app.appendChild(c1) ;
        app.appendChild(c2) ;
        let ctx1 = c1.getContext('2d') ;
        let ctx2 = c2.getContext('2d') ;
        let _pos_w = width/2 ;
        let _pos_h = height*0.6 ;
        self._pos_w = _pos_w ;
        self._pos_h = _pos_h ;
        self.ctx1 = ctx1 ;
        self.ctx2 = ctx2 ;

        //渲染ctx2 白条与刻度
        for(let i=0 ; i<=segment ; i++){
          if(i!==0&&i!==segment){
            ctx2.save() ;
            ctx2.beginPath();
            ctx2.lineWidth = 0.16*r;
            ctx2.strokeStyle = 'white' ;
            ctx2.arc(_pos_w,_pos_h,r,(Math.PI/180)*(150+(240/segment)*i),(Math.PI/180)*(151+(240/segment)*i),false);
            ctx2.stroke();
            ctx2.closePath() ;
            ctx2.restore() ;
          }

          ctx2.font=''+0.09*r+'px Arial';
          ctx2.textAlign = "center";
          ctx2.textBaseline = 'middle';
          ctx2.save() ;
          var rad = (Math.PI/180)*(150+i*(480/segment)*0.5) ;
          var x = Math.cos(rad) * (r -0.17*r);
          var y = Math.sin(rad) * (r -0.17*r);
          ctx2.fillText(''+parseInt(i*degree/segment), _pos_w+x, y+_pos_h) ;
          ctx2.restore() ;

        }

        //渲染ctx1
        for(let i=0 ;i <481 ;i++){
          ctx1.save() ;
          ctx1.beginPath();
          ctx1.lineWidth = r*0.15;
          ctx1.strokeStyle = '#99CCFF';
          ctx1.arc(_pos_w,_pos_h,r,(Math.PI/180)*(150+i*0.5),(Math.PI/180)*(151+i*0.5),false);
          ctx1.stroke();
          ctx1.closePath() ;
          ctx1.restore() ;
        }

        ctx1.save() ;
        ctx1.font=''+0.12*r+'px Arial';
        ctx1.textAlign = "left";
        ctx1.fillText('%', _pos_w+0.15*r, _pos_h-0.09*r)
        ctx1.restore() ;

        ctx1.save() ;
        ctx1.beginPath();
        ctx1.lineWidth = 0.05*r;
        ctx1.strokeStyle = '#F2F4FF' ;
        ctx1.arc(_pos_w,_pos_h,r+0.2*r,(Math.PI/180)*150,(Math.PI/180)*390,false);
        ctx1.stroke();
        ctx1.closePath() ;
        ctx1.restore() ;
      },
      setValue(target_val){
        var self = this ;
        var _pos_w = self._pos_w ;
        var _pos_h = self._pos_h ;
        var r = self.r ;
        var old_i = self.val_i ;
        var new_i = 0 ;
        var ctx1 = self.ctx1 ;
        var target_i = 480*(target_val/self.degree) ;

        new TWEEN.Tween({i:old_i})
          .to({ i:target_i }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(function() {
            ctx1.beginPath();
            ctx1.lineWidth = r*0.15;
            new_i = this.i ;
            // console.log(old_i)
            if(target_i>=old_i){
              var c_r = self._s_color[0] - Math.round(self._rgb.const_r*new_i) ;
              var c_g = self._s_color[1] - Math.round(self._rgb.const_g*new_i) ;
              var c_b = self._s_color[2] - Math.round(self._rgb.const_b*new_i) ;
              ctx1.strokeStyle = 'rgb('+c_r+','+c_g+','+c_b+')';
              ctx1.arc(_pos_w,_pos_h,r,(Math.PI/180)*(150+old_i*0.5),(Math.PI/180)*(151+new_i*0.5),false);
            }else{
              ctx1.strokeStyle = '#99CCFF';
              ctx1.arc(_pos_w,_pos_h,r,(Math.PI/180)*(152+old_i*0.5),(Math.PI/180)*(151+new_i*0.5),true);
            }
            old_i = new_i ;
            ctx1.stroke();
            ctx1.closePath() ;
            self._changeNum(new_i)
          })
          .start()
          .onComplete(function () {
            self.val_i = target_i ;
          })

      },
      _changeNum(new_i){
        var self = this ;
        var r = self.r ;
        var ctx1 = self.ctx1 ;
        ctx1.save() ;
        ctx1.font='bold '+0.25*r+'px Arial';
        ctx1.textAlign = "right";
        ctx1.clearRect( self._pos_w-0.14*r, self._pos_h-0.20*r, 0.30*r, 0.27*r);
        ctx1.fillText(Math.ceil(new_i*100/480)+'', self._pos_w+0.15*r, self._pos_h) ;
        ctx1.restore() ;
      },
      _createCanvas(width,height){ //创建高清canvas
        let dpr = Math.max(window.devicePixelRatio || 1, 1) ;
        let canvas = document.createElement('canvas')
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        canvas.setAttribute('width', width * dpr)
        canvas.setAttribute('height', height * dpr)
        if (dpr !== 1) {
          canvas.getContext('2d').scale(dpr, dpr)
        }
        return canvas
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
