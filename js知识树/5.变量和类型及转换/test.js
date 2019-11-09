function accMul(arg1, arg2) {
    var m = 0, s1 = String(arg1), s2 = String(arg2);
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
console.log(Math.round(accMul(1.255, 100)) / Math.pow(10, 2)) // 1.26
console.log(Math.round(accMul(1.755, 100)) / Math.pow(10, 2)) // 1.76


// console.log(accMul(1.255, 100))
