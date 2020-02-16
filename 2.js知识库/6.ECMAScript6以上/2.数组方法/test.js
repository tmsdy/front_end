let arr = [
    {
        name: 'feifei1',
        tag: false
    },
    {
        name: 'feifei2',
        tag: false
    },
    {
        name: 'feifei3',
        tag: false
    },
]

console.log(arr.every(item => !item.tag))
