class Water {

}

class Animal {
  public age: number;
  public name: string;

  public water: Water; // 依赖水类
  public eat() {

  }
  public drink() {

  }

}

interface Eggs { // 接口是行为的抽象
  layEggs(): void
}

class Bird extends Animal implements Eggs {
  public swing: number;
  public fly() {

  }
  layEggs() {

  }
}