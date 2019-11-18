//Promise
const sleep1 = time => {
    return new Promise(resolve => setTimeout(resolve, time))
}
sleep1(1000).then(() => {
    console.log(1)
})

//async
function sleep2(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}
async function output() {
    let out = await sleep2(200);
    console.log(1);
    return out;
}
output();

//ES5
