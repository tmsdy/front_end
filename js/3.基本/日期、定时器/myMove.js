// JavaScript Document
//透明度,和方位变化函数
		//对象，透明度变化速度，方向运动速度，透明度目标，方向目标，回调函数
		function opacMove(obj ,vop ,vpot,tarop,tarpot,endFn){
			vop = parseFloat(getStyle(obj,'opacity')) <tarop ? vop:-vop ;
			vpot = parseInt(getStyle(obj,'top')) <tarpot ? vpot:-vpot ;
			clearInterval(obj.timer1) ;
	
			obj.timer1= setInterval(function(){
				var opac = parseFloat(getStyle( obj, 'opacity'))+vop ;
				var speed = parseInt(getStyle( obj, 'top' )) + vpot;
				if ( opac < tarop && vop<0||opac > tarop && vop>0 ) {
					opac = tarop;
				}
				if ( speed < tarpot && vpot<0||speed > tarpot && vpot>0 ) {
					speed = tarpot;
				}
				obj.style.top = speed +'px';
				obj.style.opacity = opac ;
				
				if ( opac == tarop) {
					clearInterval( obj.timer1 );
				}
			},60) ;
	
		}
//常规运动函数
function doMove(abj ,attr ,dir ,target,endFn){
		dir = parseInt(getStyle(abj,attr)) <target ? dir:-dir ;
		clearInterval( abj.timer );
	
		abj.timer = setInterval(function () {
		
		var speed = parseInt(getStyle( abj, attr )) + dir;			// 步长
		
		if ( speed < target && dir<0||speed > target && dir>0 ) {
			speed = target;
		}
		abj.style[attr] = speed + 'px';
		if ( speed == target ) {
			clearInterval( abj.timer );
			//下面两种写法等价
			//if ( endFn ) {endFn();}
			endFn && endFn();
		}
		}, 30);
			
	}
//抖函数
//对象，方向，幅度，回调函数
function fnShake(obj,attr,A,endFn){
		var pos = parseInt(getStyle(obj,attr)) ;
		var arr = [] ;
		var num = 0 ;
		
		for(var i=A; i>0 ; i-=2){
			arr.push(i,-i) ;
		};
		arr.push(0) ;
		clearInterval(obj.shake) ;
			obj.shake = setInterval(function(){
				obj.style[attr] = pos+arr[num]+'px' ;
				num++ ;
				if(num === arr.length){
					clearInterval(obj.shake) ;
					endFn && endFn() ;
				}
			} , 50 );
	}
//动，透明度，抖动结合函数
function mos(obj ,vop ,vpot,tarop,tarpot,attr,endFn){
			var pos = parseInt(getStyle(obj,attr)) ;
			var arr = [] ;
			var num = 0 ;
			for(var i=20; i>0 ; i-=2){
					arr.push(i,-i) ;
				};
				arr.push(0) ;
				clearInterval(obj.shake) ;
					obj.shake = setInterval(function(){
						obj.style[attr] = pos+arr[num]+'px' ;
						num++ ;
						if(num === arr.length){
							clearInterval(obj.shake) ;
							endFn && endFn() ;
						}
					} , 50 );
			vop = parseFloat(getStyle(obj,'opacity')) <tarop ? vop:-vop ;
			vpot = parseInt(getStyle(obj,'top')) <tarpot ? vpot:-vpot ;
			clearInterval(obj.timer1) ;
	
			obj.timer1= setInterval(function(){
				var opac = parseFloat(getStyle( obj, 'opacity'))+vop ;
				var speed = parseInt(getStyle( obj, 'top' )) + vpot;
				if ( opac < tarop && vop<0||opac > tarop && vop>0 ) {
					opac = tarop;
				}
				if ( speed < tarpot && vpot<0||speed > tarpot && vpot>0 ) {
					speed = tarpot;
				}
				obj.style.top = speed +'px';
				obj.style.opacity = opac ;
				
				if ( opac == tarop) {
					clearInterval( obj.timer1 );
				}
			},60) ;
	
		}


function getStyle ( obj, attr ) { return obj.currentStyle?obj.currentStyle[attr] : getComputedStyle( obj )[attr]; }