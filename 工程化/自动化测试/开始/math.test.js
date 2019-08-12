var result = add(3, 7)
var expected = 10

if(result !== 10){
  throw Error(`3 + 7 应该等于 ${expected}, 但是结果却是 ${result}`)
}