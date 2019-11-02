
let currentCtid = 123
let companyCtid = 123
let params = {}

if (currentCtid && currentCtid != companyCtid) {
    params.ctid = currentCtid
    params.targetCtid = currentCtid
} else {
    params.targetCtid = companyCtid
}

console.log(params)