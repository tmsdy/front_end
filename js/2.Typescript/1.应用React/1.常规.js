/*

1.使用组件声明时的Component<P, S>泛型参数声明，来代替PropTypes
    1）class组件都要指明props和state类型,不声明也不报错但是组件失去访问和类型检查

2.全局变量或者自定义的window对象属性，统一在项目根下的global.d.ts中进行声明定义

3.对于项目中常用到的接口数据对象，在types/目录下定义好其结构化类型声明

4.readonly state
    1)如果用到了state，除了在声明组件时通过泛型参数传递其state结构，还需要在初始化state时声明为 readonly
        因为我们使用 class properties 语法对state做初始化时，会覆盖掉Component<P, S>中对state的readonly标识。
    2)如果state很复杂不想一个个都初始化，可以结合类型断言初始化state为空对象或者只包含少数必须的值的对象：  
        readonly state = {} as IState;

5.


*/