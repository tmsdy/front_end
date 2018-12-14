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
                                    <li :class="{on: n == index}" v-for="album,index in item.album" @mouseover="change(index)">
                                        <img :src="album" style="width: 54px;" />
                                    </li>
                                </ul>
                            </div>
                            <div class="thumb">
                                <ul>
                                    <li>
                                        <img v-if="item.album" :src="item.album[n]" style="width: 440px;" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="banner">
                        <div class="sku-custom-title">
                            <div class="params-price">
                                <span><em>¥</em><i>{{(item.price / 100).toFixed(2)}}</i></span>
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

                                    <li :class="{cur: child == item}" v-for="child in items.children">
                                        <router-link :to="{name: 'Detail', params: {id: child.id}}">
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
                                        <span class="down down-disabled">-</span>
                                        <span class="num">1</span>
                                        <span class="up up-disabled">+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sku-status">
                            <div class="cart-operation-wrapper clearfix">
                                <span class="blue-title-btn js-add-cart"><a>加入购物车</a></span>
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
    import THeader from '@/components/THeader'

    import '@/assets/css/item.css';

    import axios from 'axios'

    export default {
        name: 'Detail',
        data() {
            return {
                items: {},
                item: {},
                n: 0
            }
        },
        components: {
            THeader
        },
        created() {
            // console.log('created');
            // const id = this.$route.params.id;
            this.getData( this.$route.params.id );
        },
        methods: {
            change(v) {
                this.n = v;
            },
            getData(id) {

                // console.log(id);

                axios({
                    method: 'GET',
                    url: 'http://localhost:9999/item/' + id
                }).then( ({data}) => {
                    // console.log(data);

                    this.items = data.data;

                    this.item = this.items.children.find( val => val.id == id );
                } );
            }
        },
        beforeRouteUpdate(to, from, next) {
            // console.log('beforeRouteUpdate');

            console.log(to);

            this.getData( to.params.id );

            next();
        }
    }
</script>
