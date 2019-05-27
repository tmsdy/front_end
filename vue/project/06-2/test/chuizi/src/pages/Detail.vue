<template>
    <div>

        <t-header></t-header>
        <div id="main">
            <div class="store-content item">
                <div class="item-box">
                    <div class="gallery-wrapper">
                        <div class="gallery">
                            <div class="thumbnail">
                                <ul>
                                    <li :class="{on : n == index}" v-for="album,index in item.album" @mouseover="change_album(index)">
                                        <img style="width: 54px ;" :src="album" >
                                    </li>
                                </ul>
                            </div>
                            <div class="thumb">
                                <ul>
                                    <li class="on">
                                        <img v-if="item.album" :src="item.album[n]" style="width: 440px;">
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="banner">
                        <div class="sku-custom-title">
                            <div class="params-price">
                                <span><em>¥</em><i>{{(quantity*item.price / 100).toFixed(2)}}</i></span>
                            </div>
                            <div class="params-info">
                                <h4>{{items.title}}</h4>
                                <h6>{{items.subTitle}}</h6>
                            </div>
                        </div>
                        <div class="sku-dynamic-params-panel">
                            <div class="sku-dynamic-params clear">
                                <span class="params-name">颜色</span>
                                <ul class="params-colors">
                                    <!--<li :class="{'cur':child == item}" v-for="child in items.children">-->
                                        <!--<router-link :to="{name:'Detail',params:{currentId:child.id}}">-->
                                            <!--<i>-->
                                                <!--<img :src="child.colorStyle" />-->
                                            <!--</i>-->
                                        <!--</router-link>-->
                                    <!--</li>-->
                                    <li :class="{'cur':child == item}" v-for="child in items.children" @click="selectChild(child.id)">
                                        <router-link :to="{name:'Detail'}">
                                            <i>
                                                <img :src="child.colorStyle" />
                                            </i>
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                            <div class="sku-dynamic-params clear">
                                <div class="params-name">数量</div>
                                <div class="params-detail clear">
                                    <div class="item-num js-select-quantity">
                                        <span class="down" @click="decrease">-</span>
                                        <span class="num">{{quantity}}</span>
                                        <span class="up" @click="add">+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sku-status">
                            <div class="cart-operation-wrapper clearfix">
                                <span class="blue-title-btn js-add-cart" @click="addCart"><a>加入购物车</a></span>
                                <span class="gray-title-btn"><a>现在购买</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import THeader from '@/components/THeader' ;

    import '@/assets/css/item.css' ;

    import axios from 'axios'

    export default {
        name: "detail",
        components:{
            THeader
        },
        data(){
            return{
                id:0 ,
                currentId:0 ,
                items:{},
                item:{},
                quantity:1 ,
                n : 0
            }
        },
        created(){
            console.log(this.$route.params) ;
            // console.log(this.$store)
            if(this.$route.params.currentId){
                this.id = this.$route.params.id ;
                this.currentId = this.$route.params.currentId ;
            }else{
                this.id = this.$store.state.item_id ;
                this.currentId = this.$store.state.currentId ;
            }
            this.getData(this.id,this.currentId) ;
        },
        methods:{
            change_album(index){
                this.n = index ;
            },
            getData(id,currentId){
                axios({
                    method:'GET',
                    url: 'http://localhost:9999/item/'+id
                }).then(({data})=>{
                    // console.log(data)
                    if(!data.code){
                        this.$store.dispatch('saveItemId',{id,currentId}) ;
                        this.items = data.data ;
                        this.item = this.items.children.find( child => child.id == currentId )
                    }
                })
            },
            selectChild(currentId){
                this.getData(this.id,currentId) ;
            },
            decrease(){
                if(this.quantity>1){
                    this.quantity -= 1 ;
                }
            },
            add(){
                this.quantity += 1 ;
            },
            addCart(){
                this.$store.dispatch('addCart',{item_id:this.item.id,quantity:this.quantity}) ;
            }
        },
        //路由发生变化，组件复用时调用这个渲染界面
        // beforeRouteUpdate(to, from, next) {
        //     // console.log('beforeRouteUpdate');
        //     console.log(to);
        //     this.getData( this.id,to.params.currentId );
        //     next();
        // }
    }
</script>

<style scoped>

</style>
