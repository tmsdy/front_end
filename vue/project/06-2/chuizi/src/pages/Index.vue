<template>
    <div>
        <t-header></t-header>
        <div id="main">
            <div class="sku-box store-content">
                <div class="sort-option">
                    <ul class="line clear">
                        <li><a href="javascript:;" class="active">综合排序</a></li>
                        <li><a href="javascript:;" class="">销量排序</a></li>
                        <li><a href="javascript:;" class="">价格低到高</a></li>
                        <li><a href="javascript:;" class="">价格高到低</a></li>
                    </ul>
                </div>
                <div class="gray-box">
                    <div class="item-box">

                        <t-item v-for="item in items" :data="item" :key="item.id"></t-item>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import THeader from '@/components/THeader' ;
    import TItem from '@/components/TItem' ;

    import axios from 'axios'

    import '@/assets/css/goodsList.css' ;

    export default {
        name: "index",
        components:{
            THeader,
            TItem
        },
        data(){
          return {
              items:[]
          }
        },
        created(){
            axios({
                method:'GET',
                url: 'http://localhost:9999/item'
            }).then(({data})=>{
                if(!data.code){
                    this.items = data.data ;
                }
            }) ;

        }
    }
</script>

<style scoped>


</style>
