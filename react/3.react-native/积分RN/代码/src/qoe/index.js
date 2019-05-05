 // 初始化对象

 import QOE from '@iqiyi/main-qoe'

 class SingletonQoe {
   constructor() {
     if(SingletonQoe.prototype.Instance === undefined) {
       const options = {
        //  bc: 'h5_rn', // 子业务标识
         p1: '2_20_201', // 主业务标识
         sampleRate: 100 // 控制抽样概率
       }
       SingletonQoe.prototype.Instance = new QOE(options)
     }
     return SingletonQoe.prototype.Instance
   }
 }

 const RNQoe = new SingletonQoe()

 // 业务逻辑打点，定位错误
 export const sendQoeMark = (name = 'mark', data = {}) => {
  RNQoe.sendInterface(name, data)
 }

 export default RNQoe
