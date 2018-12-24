// 主题，接收状态变化，触发每个观察者
class Subject {
  constructor() {
      this.state = 0
      this.watchers = []
  }
  getState() {
      return this.state
  }
  setState(state) {
      this.state = state
      this.notifyAllWatchers()
  }
  attach(watcher) {
      this.watchers.push(watcher)
  }
  notifyAllWatchers() {
      this.watchers.forEach(watcher => {
          watcher.update()
      })
  }
}

// 观察者，等待被触发
class Watcher {
  constructor(name, subject) {
      this.name = name
      this.subject = subject
      this.subject.attach(this)
  }
  update() {
      console.log(`${this.name} update, state: ${this.subject.getState()}`)
  }
}

// 测试代码
let s = new Subject()
let o1 = new Watcher('o1', s)
let o2 = new Watcher('o2', s)
let o3 = new Watcher('o3', s)

s.setState(1)
s.setState(2)
s.setState(3)