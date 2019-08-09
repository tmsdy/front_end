let NoContext = 0b000
let ConcurrentMode = 0b001
let StrictMode = 0b010
let ProfileMode = 0b100
let mode

// 判断是不是ConcurrentMode
console.log(0b001 & ConcurrentMode) // 1
console.log(0b000 & ConcurrentMode) // 0

mode = mode | ConcurrentMode //如果mode没有就给它赋值ConcurrentMode
console.log(mode & ConcurrentMode) // 1
mode |= StrictMode //和上面或操作一样，现在mode有了ConcurrentMode和StrictMode
console.log(mode & ConcurrentMode) // 1
console.log(mode & StrictMode) //2
