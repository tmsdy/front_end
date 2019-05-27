<template>
    <div>

        <t-header></t-header>

        <div id="main" class="hander-car">
            <div class="store-content">
                <div class="cart-box">
                    <div class="title">
                        <h2>购物清单</h2>
                    </div>
                    <div class="cart-inner">
                        <div class="empty-label hide">
                            <h3>您的购物车中还没有商品</h3>
                            <a class="link" href="javascript:;">现在选购</a>
                        </div>
                        <div>
                            <div class="cart-table-title">
                                <span class="name">商品信息</span>
                                <span class="operation">操作</span>
                                <span class="subtotal">小计</span>
                                <span class="num">数量</span>
                                <span class="price">单价</span>
                            </div>
                            <div class="cart-table">
                                <div class="cart-group">
                                    <!--购物列表-->
                                    <div class="cart-top-items" v-for="cart of carts">
                                        <div class="cart-items">
                                            <div class="items-choose">
                                                <span class="blue-checkbox-new" :class="{'checkbox-on':cart.checked}"  @click="checkCart(cart.id,!cart.checked)"><a></a></span>
                                            </div>
                                            <div class="items-thumb">
                                                <img :src="cart.cover">
                                                <a href="javascript:;" target="_blank"></a>
                                            </div>
                                            <div class="name hide-row" >
                                                <div class="name-table">
                                                    <a href="javascript:;" target="_blank">{{cart.title}}</a>
                                                    <ul class="attribute">
                                                        <li>{{cart.name}}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="operation">
                                                <a class="items-delete-btn" ></a>
                                            </div>
                                            <div class="subtotal">¥ {{(cart.quantity*cart.price/100).toFixed(2)}}</div>
                                            <div class="item-cols-num">
                                                <div class="select js-select-quantity">
                                                    <span class="down down-disabled">-</span>
                                                    <span class="num">
														<input type="text" :value="cart.quantity" style="display: inline-block;">
													</span>
                                                    <span class="up">+</span>

                                                </div>
                                            </div>
                                            <div class="price">¥ {{(cart.price/100).toFixed(2)}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="cart-bottom-bg fix-bottom">
                        <div class="cart-bar-operation">
                            <div>
                                <div class="choose-all js-choose-all">
                                    <span class="blue-checkbox-new" :class="{'checkbox-on':this.data.checkAll}">
                                        <a></a>
                                    </span>
                                    全选
                                </div>
                                <div class="delete-choose-goods">删除选中的商品</div>
                            </div>
                        </div>
                        <div class="shipping">
                            <div class="shipping-box">
                                <div class="shipping-total shipping-num">
                                    <h4 class="">
                                        已选择 <i>{{this.data.checkedNum}}</i> 件商品
                                    </h4>
                                    <h5>
                                        共计 <i >{{this.data.total}}</i> 件商品
                                    </h5>
                                </div>
                                <div class="shipping-total shipping-price">
                                    <h4 class="">
                                        应付总额：<span>￥</span><i >{{(this.data.totalPrice/100).toFixed(2)}}</i>
                                    </h4>
                                    <h5 class="shipping-tips">
                                        应付总额不含运费
                                    </h5>

                                </div>
                            </div>
                            <span class="jianguo-blue-main-btn big-main-btn js-checkout" :class="{'disabled-btn':this.data.checkedNum==0}"><a>现在结算</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import THeader from '@/components/THeader' ;

    import '@/assets/css/cart.css' ;

    export default {
        name: "cart",
        data(){
          return{
              data:{}
          }
        },
        components:{
            THeader
        },
        computed : {
            carts(){
                // this.$store.state.carts.forEach((item)=>{
                //     this.quantity += item.quantity ;
                //     this.price += item.quantity*item.price ;
                // })
                //如果carts里面每个的checked都为真checkAll才为真，否则为假
                this.data = this.$store.state.carts.reduce((prev,current)=>{
                    return{
                        checkAll : current.checked ===false ? false : prev ,
                        checkedNum : current.checked === true ? prev.checkedNum+1 :  prev.checkedNum,
                        total : prev.total+1 ,
                        totalPrice : current.checked === true ? prev.totalPrice + current.price*current.quantity:prev.totalPrice
                    }
                },{
                    checkAll:true ,
                    checkedNum: 0 ,
                    total : 0 ,
                    totalPrice : 0
                });
                // console.log(this.data) ;

                return this.$store.state.carts ;
            }
        },
        methods:{
            checkCart(cart_id,checked){
                this.$store.dispatch('checkCart',{cart_id,checked}) ;
            }
        }
    }
</script>

<style scoped>

</style>
