function Others() {
    this.test = 'test'
}

function Parent() {
    this.aaa = '111'
    Parent.prototype.hello = () => {
        console.log('hello')
    }
}

function Child(name) {
    Parent.apply(this)
    this.name = name
    Child.prototype.sayName = () => {
        console.log(this.name)
    }
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

Child.__proto__ = Parent

let feifei = new Child('feifei')

console.log(instance_of(feifei, Child))
console.log(instance_of(feifei, Parent))
console.log(instance_of(feifei, Others))

function instance_of(L, R) {
    var O = R.prototype
    L = L.__proto__
    while (true) {
        if (L === null) return false
        if (O === L) return true
        L = L.__proto__
    }
}