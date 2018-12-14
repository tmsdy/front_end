<template>
    <li class="nav-cart">
        <a href="javascript:;">购物车</a>
        <!--根据class改变颜色-->
        <span class="cart-empty-num cart-num">
            <i>{{carts.length}}</i>
        </span>
        <div class="nav-cart-wrapper">
            <div class="nav-cart-list">
                <div class="empty" v-if="carts.length==0">
                    <h3>购物车为空</h3>
                    <p>您还没有选购任何商品，现在前往商城选购吧!</p>
                </div>
                <div class="full" v-else>
                    <div class="nav-cart-items">
                        <ul>
                            <li class="clear" v-for="cart of carts">
                                <div class="cart-item js-cart-item cart-item-sell">
                                    <div class="cart-item-inner">
                                        <div class="item-thumb">
                                            <img :src="cart.cover">
                                        </div>
                                        <div class="item-desc">
                                            <div class="cart-cell">
                                                <h4>
                                                    <router-link :to="{name: 'Detail',params:{id:cart.itemId}}">{{cart.title}}</router-link>
                                                </h4>
                                                <p class="attrs">
                                                    <span>{{cart.name}}</span>
                                                </p>
                                                <h6>
                                                    <span class="price-icon">¥</span>
                                                    <span class="price-num">{{(cart.price / 100).toFixed(2)}}</span>
                                                    <span class="item-num">x {{cart.quantity}}</span>
                                                </h6>
                                            </div>
                                        </div>
                                        <div class="del-btn" @click="remove(cart.id)">删除</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="nav-cart-total">
                        <p>共 <strong class="ng-binding">{{quantity}}</strong> 件商品</p>
                        <h5>合计：<span class="price-icon">¥</span><span class="price-num ng-binding" ng-bind="cartMenu.totalPrice">{{(price/100).toFixed(2)}}</span></h5>
                        <h6>
                            <router-link :to="{name:'Cart'}" class="nav-cart-btn">去购物车</router-link>
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>

<script>
    export default {
        name: "t-header-cart",
        data() {
            return {
                quantity: 0,
                price: 0
            };
        },
        computed : {
            carts(){
                this.quantity = 0 ;
                this.price = 0 ;
                this.$store.state.carts.forEach((item)=>{
                    this.quantity += item.quantity ;
                    this.price += item.quantity*item.price ;
                })
                return this.$store.state.carts ;
            }
        },
        methods:{
            remove(cartId){
                // console.log(cartId)
                this.$store.dispatch('removeCart',cartId) ;
            }
        }
    }
</script>

<style scoped>

</style>
