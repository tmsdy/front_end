<template>
  <div id="app">
    <!--<multiple-xz :options="mul_options"></multiple-xz>-->
    <!--<single-xz :options="sg_options"></single-xz>-->
    <!-- <cv-meter
    :r="100"
    :percent="0.4"
    :segment="5"
    :degree="1000"
    ></cv-meter> -->
    <lazy-load-img></lazy-load-img>
  </div>
</template>

<script>
import MultipleXz from './components/MultipleXz'
import SingleXz from './components/SingleXz'
import CvMeter from './components/CvMeter'
import LazyLoadImg from './components/LazyLoadImg'

export default {
  name: 'App',
  components: {
    MultipleXz,SingleXz,CvMeter,LazyLoadImg
  },
  data(){
    return {
      mul_options: [
      {
        value: '1',
        label: '黄金糕',
        _selected:false ,
      }, {
        value: '2',
        label: '双皮奶',
        _selected:true ,
      }, {
        value: '3',
        label: '蚵仔煎',
        _selected:true ,
      }, {
        value: '4',
        label: '龙须面',
        _selected:false ,
      }, {
        value: '5',
        label: '北京烤鸭',
        _selected:false ,
      }
    ],
    sg_options:[
      {
        value: '1',
        label: '黄金糕',
      }, {
        value: '2',
        label: '双皮奶',
      }, {
        value: '3',
        label: '蚵仔煎',
      }, {
        value: '4',
        label: '龙须面',
      }, {
        value: '5',
        label: '北京烤鸭',
      }
    ]
    }
  }
}
</script>

<style>

</style>
