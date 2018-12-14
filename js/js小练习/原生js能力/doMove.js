// JavaScript Document
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


function getStyle ( obj, attr ) { return obj.currentStyle?obj.currentStyle[attr] : getComputedStyle( obj )[attr]; }