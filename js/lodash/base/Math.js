
import Vue from 'vue'
import add from '../lodash-master/add.js';
import ceil from '../lodash-master/ceil.js';
import maxBy from '../lodash-master/maxBy.js';
import mean from '../lodash-master/mean.js';
import sum from '../lodash-master/sum.js';
import sumBy from '../lodash-master/sumBy.js';


new Vue({
  el: '#app' ,
  template: `<div>555</div>` ,
  created(){
    // 加减乘除，三种取整，数组中最大最小值，平均值,求和
    console.log(add(1,5)) //6 减乘除同理
    console.log(ceil(4.006),ceil(6.004, 2),ceil(6040, -2)) //5 6.01 6100 向下取整、四舍五入同理

    var objects = [{ 'n': 1 }, { 'n': 2 }];
    console.log(maxBy(objects, (o) => o.n)) // {n:2} {n:2} 最小值同理
    console.log(mean([4, 2, 8, 6])) //5 也有meanBy写法

    console.log(sum([4, 2, 8, 6])) //20
    var objects2 = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
    console.log(sumBy(objects2,(o) => o.n)) ; //20

  },
  methods:{
    
  }
})

