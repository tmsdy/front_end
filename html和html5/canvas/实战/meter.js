(function(){

  function createCanvas (width, height) { //创建高清canvas
    var dpr = Math.max(window.devicePixelRatio || 1, 1)
    var canvas = document.createElement('canvas')
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    canvas.setAttribute('width', width * dpr)
    canvas.setAttribute('height', height * dpr)
    if (dpr !== 1) {
      canvas.getContext('2d').scale(dpr, dpr)
    }
    return canvas
  }

  function RenderProgress (container,percent,start_color,end_color,_r) {
    var width = 3*_r;
    var height = 2.2*_r;
    var c1 = createCanvas(width,height) ;
    var c2 = createCanvas(width,height) ;
    c1.style.position = 'absolute' ;
    c1.style.zIndex = '10' ;
    c2.style.position = 'absolute' ;
    c2.style.zIndex = '100' ;
    container.appendChild(c1) ;
    container.appendChild(c2) ;
    var ctx1 = c1.getContext('2d') ;
    var ctx2 = c2.getContext('2d') ;
    var w_canvas = width/2 ;
    var h_canvas = height*0.6 ;

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

    function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    requestAnimationFrame(animate);

    var s_color = start_color.colorRgb().split(',') ;
    var end_color = end_color.colorRgb().split(',') ;
    var const_r = 1/(percent*480)*(s_color[0]-end_color[0]) ;
    var const_g = 1/(percent*480)*(s_color[1]-end_color[1]) ;
    var const_b = 1/(percent*480)*(s_color[2]-end_color[2]) ;
    var old_i = 0 ;
    var new_i = 0 ;
    var coords = { i:0 };
    var tween = new TWEEN.Tween(coords)
      .to({ i:percent*480 }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(function() {
        ctx1.beginPath();
        ctx1.lineWidth = _r*0.15;
        new_i = coords.i ;
        var r = s_color[0] - Math.round(const_r*new_i) ;
        var g = s_color[1] - Math.round(const_g*new_i) ;
        var b = s_color[2] - Math.round(const_b*new_i) ;
        ctx1.strokeStyle = 'rgb('+r+','+g+','+b+')';
        ctx1.arc(w_canvas,h_canvas,_r,(Math.PI/180)*(150+old_i*0.5),(Math.PI/180)*(151+new_i*0.5),false);
        old_i = new_i ;
        ctx1.stroke();
        ctx1.closePath() ;
      })
      .start();

    ctx1.save() ;
    ctx1.font='bold '+0.25*_r+'px Arial';
    ctx1.textAlign = "right";
    ctx1.fillText(percent*100+'', w_canvas+0.15*_r, h_canvas)
    ctx1.restore() ;

    ctx1.save() ; //画底色
    ctx1.font=''+0.09*_r+'px Arial';
    ctx1.textAlign = "center";
    ctx1.textBaseline = 'middle';
    for(var i=0 ;i <481 ;i++){
      ctx1.lineWidth = _r*0.15;
      ctx1.beginPath();
      if(i%120===0){
        var rad = (Math.PI/180)*(150+i*0.5) ;
        var x = Math.cos(rad) * (_r -0.17*_r);
        var y = Math.sin(rad) * (_r -0.17*_r);
        switch (i) {
          case 0 : ctx1.fillText('0', w_canvas+x, y+h_canvas) ; break ;
          case 120 : ctx1.fillText('25', w_canvas+x, y+h_canvas) ; break ;
          case 240 : ctx1.fillText('50', w_canvas+x, y+h_canvas) ; break ;
          case 360 : ctx1.fillText('75', w_canvas+x, y+h_canvas) ; break ;
          case 480 : ctx1.fillText('100', w_canvas+x, y+h_canvas) ; break ;
        }
      }
      if(i>1 && (i%120===0 || i%120===1)){
        ctx1.strokeStyle = 'white';
      }else {
        ctx1.strokeStyle = 'rgba(82,113,255,0.14)';
      }
      ctx1.arc(w_canvas,h_canvas,_r,(Math.PI/180)*(150+i*0.5),(Math.PI/180)*(151+i*0.5),false);
      ctx1.stroke();
      ctx1.closePath() ;
    }
    ctx1.restore() ;

    for(var i=1 ; i<4 ; i++){ //3个盖上去的白条
      ctx2.beginPath();
      ctx2.lineWidth = 0.15*_r;
      ctx2.strokeStyle = 'white' ;
      ctx2.arc(w_canvas,h_canvas,_r,(Math.PI/180)*(150+60*i),(Math.PI/180)*(151+60*i),false);
      ctx2.stroke();
      ctx2.closePath() ;
    }

    ctx1.save() ;
    ctx1.font=''+0.12*_r+'px Arial';
    ctx1.textAlign = "left";
    ctx1.fillText('%', w_canvas+0.15*_r, h_canvas-0.09*_r)
    ctx1.restore() ;

    ctx1.beginPath();
    ctx1.lineWidth = 0.05*_r;
    ctx1.strokeStyle = '#F2F4FF'
    ctx1.arc(w_canvas,h_canvas,_r+0.2*_r,(Math.PI/180)*150,(Math.PI/180)*390,false);

    ctx1.stroke();
    ctx1.closePath() ; //如果调换这两顺序，弧会闭合

  }

  window.RenderProgress = RenderProgress
})()