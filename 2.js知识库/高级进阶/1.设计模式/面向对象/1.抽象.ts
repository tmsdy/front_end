/*
* 面向对象：以类和对象来实现封装、抽象、继承、多态四个特性
* 抽象：隐藏方法的实现，外面只需知道你有哪些功能就行，可扩展性和可维护性好
*/
interface IStorage {
  save(key: any, value: any): void;
  read(key: any): void;
}

class LocalStorage implements IStorage {
  save(key: any, value: any) {
    localStorage.setItem(key, value);
  }
  read(key: any) {
    return localStorage.getItem(key);
  }
}

class User {
  public name: string
  public storage: IStorage
  constructor(name, storage) {
    this.name = name
    this.storage = storage
  }
  save() {
    this.storage.save('userInfo', JSON.stringify(this));
  }
  read() {
    return this.storage.read('userInfo')
  }
}

let user = new User('张三', new LocalStorage())
user.save()
user.read()

