let arr = [{}, {}, {}]
arr.forEach((item, i) => {
    console.log(i)
    if (i === 1) {
        return;
    }
})
for (let i = 0; i < arr.length; i++) {
    console.log(i)
    if (i === 1) {
        return;
    }
}
