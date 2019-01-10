
class Dep{
  constructor(){
    this.state = 0 
    this.watchers = []
  }

  addDep(wacther){
    this.watchers.push(wacther)
  }
  setState(state){
    this.state = state
    this.notify()
  }
  notify(){
    this.watchers.forEach(item=>item.update(this.state))
  }

}

class Wacther{
  constructor(dep,name){
    this.dep = dep
    this.name = name
    this.dep.addDep(this)
  }
  update(state){
    console.log(`名字为${this.name}接收了的订阅变化，最新状态为${state}`)
  }
}

let d = new Dep()

let s1 = new Wacther(d,'s1')
let s2 = new Wacther(d,'s2')
let s3 = new Wacther(d,'s3')
d.setState(3)
