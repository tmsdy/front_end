var people = [
    {
        name :'feifei' ,
        age : 18
    },
    {
        name :'heihei' ,
        age : 22
    },
    {
        name :'weiwei' ,
        age : 21
    }
]

var bool20_every = people.every(item=>item.age<=20) ;
var bool20_some = people.some(item=>item.age<=20) ;

console.log(bool20_every)
console.log(bool20_some)