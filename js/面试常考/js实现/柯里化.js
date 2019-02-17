
console.log(add(1)(2))

function add(x){
	return function (y) {
		return x + y
	}
}