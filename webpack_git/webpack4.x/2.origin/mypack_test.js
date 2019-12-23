const path = require('path')
let path_a = '/a/b'
let path_b = '/a/b/c/d'
let relative_path = path.relative(path_a, path_b)
console.log(relative_path) // c/d

console.log(path.dirname(relative_path)) // c dirname返回d在哪个目录里面

