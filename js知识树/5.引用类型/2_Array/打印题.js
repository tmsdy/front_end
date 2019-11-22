var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(1) // 相当于obj[obj.length] = 1
obj.push(2) // 相当于obj[obj.length] = 1

console.log(obj)
/*

{ '2': 1,
  '3': 2,
  length: 4,
  splice: [Function: splice],
  push: [Function: push]
}

*/