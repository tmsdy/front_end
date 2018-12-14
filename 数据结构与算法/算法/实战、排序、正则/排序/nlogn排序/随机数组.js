
function genRondomArr(n,a,b){
    // if(b<a+n) return [] ;
    var arr = [] ;
    for(let i=0 ; i<n ;i++){
        arr[i] = Math.round(Math.random()*(b-a))+a
    }
    return arr ;
}