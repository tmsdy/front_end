<template>
    <div class="item" >
        <div>
            <div class="item-img">
                <img :src="data.children[n].cover" />
            </div>
            <h6>{{data.title}}</h6>
            <h3 >{{data.subTitle}}</h3>
            <div class="params-colors">
                <ul class="colors-list">
                    <li v-for="child,index in data.children" :key="child.id" @mouseover="change(index)">
                        <a href="javascript:;" :class="{'active':index == n}">
                            <img :src="child.colorStyle" />
                        </a>
                    </li>
                </ul>
            </div>
            <div class="item-btns clearfix">
                <span class="item-gray-btn">
                    <router-link :to="{name:'Detail',params:{id:data.id,currentId:data.children[n].id}}" >查看详情</router-link>
                </span>
                <span class="item-blue-btn" @click="addCart">加入购物车 </span>
            </div>
            <div class="item-price clearfix">
                <i>¥</i><span>{{(data.children[n].price / 100).toFixed(2)}}</span>
            </div>
            <div class="discount-icon">false</div>
            <div class="item-cover">
                <a href="javascript:;" target="_blank"></a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "t-item",
        props:['data'],
        data(){
            return {
                n: 0
            }
        },
        methods:{
            change(v){
                // console.log(v)
                this.n = v ;
            },
            addCart(){
                let item_id = this.data.children[this.n].id ;
                this.$store.dispatch('addCart',{item_id,quantity:1}) ;
            }
        }
    }
</script>

<style scoped>

</style>
