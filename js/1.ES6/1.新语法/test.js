
function test({ a, b, c = 111 }) {
    console.log(a, b, c)
}
test({ a: 1, b: 2 })