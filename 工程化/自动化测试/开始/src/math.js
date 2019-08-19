function add(a, b) {
  return a + b
}

function minus(a, b) {
  return a - b
}

function multi(a, b) {
  return a * b
}

try { //浏览器执行报异常，try吞掉异常。测试环境正常跑的，实际项目用不到
  module.exports = {
    add,
    minus,
    multi
  }
} catch(e){

}
