import React, { useEffect } from 'react';

export default (props) => {
    useEffect(() => {
        // 1.class和ES5的构造函数对应，让写法像面向对象的语法糖
        class Parent {
            // 2.static声明的都在Parent构造函数上，所以只能Parent.xx访问，实例访问不到
            static age = 22
            static hello() {
                console.log('hello')
            }

            /* 只能在ts中用
                public ccc = 333 // 当前类和子类都能访问，一般都是public
                private ddd = 444 // 只能当前类访问 
            */
            #count = 555 //新提案，私有属性，放到__private_0_count中,实例访问报错

            constructor(name) { //构造函数，实例一创建就会调用
                // this.xxx=xxx 赋值都在实例上
                this.name = name;
                this.getName = () => {
                    console.log(this.name)
                }
            }

            state = { // 这样写法直观，定义的属性还是在实例上
                country: 'china'
            }
            // 方法放到实例__proto__里
            getCountry() {
                console.log(this.state.country)
            }

        }
        let person = new Parent('feifei')
        console.log(person)
        console.log(person.age, Parent.age)
        person.getName()
        person.getCountry()

        class Child extends Parent {
            constructor(name, age) {
                // super(name)，相当于 ES5 的 Parent.call(this,name)
                super(name);
                this.age = age
            }
            getName() { // 可以重写父级的方法
                console.log('getName')
            }
        }
        let child = new Child('xiaofeifei', 5)
        console.log(child)
        Child.hello() //hello // 父类的静态方法，可以被子类继承
        child.getName()
    }, [])

    return (
        <div>
            class
        </div>
    )
}