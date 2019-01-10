(function(){

    const PENDING = "pending";
    const FULFILLED = "fulfilled";
    const REJECTED = "rejected";

    class MyPromise{
        constructor(executor){ //构造函数
            this._status = PENDING ;
            this._val = null ;
            this._err = null ;
            this.resolvedArr = [] ;
            this.rejectedArr = [] ;
            this._handler(executor) ;
        }
        
        _handler(exec){
            let done = false ; //控制只有一次状态改变
            exec((val)=>{ //执行的resolve走这里,val->resolve传的值
                if(done) return ;
                done = true ;
                this._resolve(val) ;
            },(err)=>{ //执行的reject走这里
                if(done) return ;
                done = true ;
                this._reject(err) ;
            })
        }
        _resolve(val){ //把状态改为成功
            setTimeout(()=>{ //保证then方法异步执行
                this._status = FULFILLED ;
                this._val = val ;
                // 执行所有成功数组里的函数
                this.resolvedArr.forEach(item=>item(this._val)) ;
            })
        }
        _reject(err){
            setTimeout(()=>{
                this._status = REJECTED ;
                this._err = err ;
                // 执行所有失败数组里的函数
                this.resolvedArr.forEach(item=>item(this._err)) ;
            })
        }
        _done(resolvedFn,rejectedFn){
            resolvedFn = typeof resolvedFn==='function'?resolvedFn:null ;
            rejectedFn = typeof rejectedFn==='function'?rejectedFn:null ;
            if(this._status==='pending'){ //收集(有多个then这种)
                if(resolvedFn)this.resolvedArr.push(resolvedFn) ;
                if(rejectedFn)this.rejectedArr.push(rejectedFn) ;
            }else if(this._status==='fulfilled'&&resolvedFn){ //点击调p.then这种
                resolvedFn(this._val) ;
            }else if(this._status==='rejected'&&rejectedFn){
                rejectedFn(this._err) ;
            }
        }
        then(resolvedFn,rejectedFn){ 
            this._done(resolvedFn,rejectedFn) ;
        }
    }
    MyPromise.all = function(promises) {
        return new MyPromise((resolve, reject) => {
          let done = gen(promises.length, resolve); //实例化gen
          promises.forEach(_Promise => {
            _Promise.then(value => {
              done(value)
            }, reject)
          })
        })
      }

      function gen(length, resolve) { 
        let count = 0;
        let valueArr = [];
        return function(value) {
            valueArr.push(value) ;
            if (++count === length) {
                resolve(valueArr);
            }
        }
      }


    window.MyPromise = MyPromise ;

})()