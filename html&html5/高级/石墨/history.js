(function(){
	let a1 = document.getElementById('a1');
	let text = document.getElementById('text');
	let city_box = document.getElementById('city-box');
	let province = document.getElementsByClassName('province');
	let city = document.getElementsByClassName('city');
	let jiedao = document.getElementsByClassName('jiedao');
	let bj_box = document.getElementById('bj-box');
	let sh_box = document.getElementById('sh-box');

	let dc_jiedao = document.getElementById('dc-jiedao');
	let xc_jiedao = document.getElementById('xc-jiedao');
	let hk_jiedao = document.getElementById('hk-jiedao');
	let yp_jiedao = document.getElementById('yp-jiedao');

	let xz_btn = document.getElementById('select-btn');

	let router = '' ;
	let mark1 = 1 ;
	let mark2 = 1 ;
	let str = '' ;

	//最开始的状态，采用replace直接替换
	history.replaceState({router},null,'');
	
	xz_btn.addEventListener('click',()=>{//选择按钮
		router = 'province' ;
		history.pushState({router},null,'#/'+router);//之后的状态，需要进行保存
		city_box.style.display = 'block' ;
		text.style.display = 'none' ;
		xz_btn.style.display = 'none' ;
	})

	for(let i=0 ; i<province.length ;i++){//1级路由
		province[i].addEventListener('click',(e)=>{
			let pid = e.target.dataset.pid ;
			router = 'province/city' ;
			city_box.style.display = 'none' ;
				if(pid==1){
					str = '北京' ;
					bj_box.style.display = 'block' ;
					history.pushState({router},null,'#/'+router);
				}else{
					mark1 += 1 ;
					str = '上海' ;
					sh_box.style.display = 'block' ;
					history.pushState({router},null,'#/'+router);
				}
		})
	}
	for(let i=0 ; i<city.length ;i++){
		city[i].addEventListener('click',(e)=>{
			let cityid = parseInt(e.target.dataset.cityid) ;
			router = 'province/city/jiedao' ;
			mark1==1?bj_box.style.display = 'none':sh_box.style.display = 'none' ;	
			switch(cityid){
				case 1 : dc_jiedao.style.display = 'block' ;str = '北京-东城' ;mark2=1;break ;
				case 2 : xc_jiedao.style.display = 'block' ;str = '北京-西城' ;mark2=2;break ;
				case 3 : hk_jiedao.style.display = 'block' ;str = '上海-虹口' ;mark2=3;break ;
				case 4 : yp_jiedao.style.display = 'block' ;str = '上海-杨浦' ;mark2=4;break ;
			}
			history.pushState({router},null,'#/'+router);		
		})
	}
	for(let i=0 ;i<jiedao.length;i++){
		jiedao[i].addEventListener('click',(e)=>{
			let jiedaoid = parseInt(e.target.dataset.jiedaoid) ;
			router='' ;
			switch(mark2){
				case 1 : dc_jiedao.style.display = 'none' ;break ;
				case 2 : xc_jiedao.style.display = 'none' ;break ;
				case 3 : hk_jiedao.style.display = 'none' ;break ;
				case 4 : yp_jiedao.style.display = 'none' ;break ;
			};
			switch(jiedaoid){
				case 1 : str = '北京-东城-东城街道1' ;break ;
				case 2 : str = '北京-东城-东城街道2' ;break ;
				case 3 : str = '北京-西城-西城街道1' ;break ;
				case 4 : str = '北京-西城-西城街道2' ;break ;
				case 5 : str = '上海-虹口-虹口街道1' ;break ;
				case 6 : str = '上海-虹口-虹口街道2' ;break ;
				case 7 : str = '上海-杨浦-杨浦街道1' ;break ;
				case 8 : str = '上海-杨浦-杨浦街道2' ;break ;
			}
			mark1=1 ;
			mark2=1 ;
			history.pushState({router},null,'#/'+router);
			text.style.display = 'block' ;
			xz_btn.style.display = 'block' ;
			text.innerHTML = str ;
		})
	}
	window.addEventListener('popstate',(e)=>{
		console.log(e.state);
		if(e.state.router==''){
			city_box.style.display = 'none' ;
			text.style.display = 'block' ;
			xz_btn.style.display = 'block' ;
		}else if(e.state.router=='province'){
			mark1==1?bj_box.style.display = 'none':sh_box.style.display = 'none' ;	
			city_box.style.display = 'block' ;
			mark1=1 ;
		}else if(e.state.router=='province/city'){
			switch(mark2){
				case 1 : dc_jiedao.style.display = 'none' ;bj_box.style.display = 'block';break ;
				case 2 : xc_jiedao.style.display = 'none' ;bj_box.style.display = 'block';break ;
				case 3 : hk_jiedao.style.display = 'none' ;sh_box.style.display = 'block';break ;
				case 4 : yp_jiedao.style.display = 'none' ;sh_box.style.display = 'block';break ;
			}
			mark2=1;
		}
	})

})()