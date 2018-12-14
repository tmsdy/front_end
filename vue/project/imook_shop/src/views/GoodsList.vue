<template>
    <div>
      <app-header></app-header>
      <bread>
        <span slot="bread">商品</span>
      </bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">排序:</span>
            <a href="javascript:void(0)" class="price" :class="{'cur':sortFlag==1}" @click="sortGoods(1)" >价格升序
            </a>
            <a href="javascript:void(0)" class="price" :class="{'cur':sortFlag==-1}" @click="sortGoods(-1)" >价格降序
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>价格区间:</dt>
                <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All</a></dd>
                <dd v-for="price,index in priceFilter">
                  <a href="javascript:void(0)"  @click="setPriceFilter(index)" :class="{'cur':priceChecked==index}">
                    {{price.startPrice}} - {{price.endPrice}}
                  </a>
                </dd>
              </dl>
            </div>
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul class="list-box">
                  <li v-for="item,index in goodsList">
                    <div class="pic">
                      <!--<a href="#"><img v-lazy="'/static/'+item.productImg" alt=""></a>-->
                      <a href="#"><img :src="'/static/'+item.productImg" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.productPrice}}元</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="40">
                  <img v-show="loading" src="./../assets/loading-spinning-bubbles.svg">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="md-overlay" v-show="overLayFlag" @click="closePop" ></div>-->
      <modal :mdShow="mdShow" @closeModal="closeModal">
        <p slot="message">亲~请先登录再操作</p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="closeModal">关闭</a>
        </div>
      </modal>
      <modal :mdShow="cartShow" @closeModal="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功！</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="cartShow=false">继续购物</a>
          <router-link to="/cart" class="btn btn--m">查看购物车</router-link>
        </div>
      </modal>
      <app-footer></app-footer>
    </div>
</template>

<script>
    import './../assets/css/base.css' ;
    import './../assets/css/product.css' ;
    import appHeader from '@/components/AppHeader'
    import appFooter from '@/components/appFooter'
    import Bread from '@/components/Bread'
    import Modal from '@/components/Modal'
    import axios from 'axios'

    export default {
      name: "goods-list",
      data(){
        return {
          goodsList: [],
          loading:false ,
          priceFilter: [
            {
              startPrice: '0.00',
              endPrice: '100.00'
            },
            {
              startPrice: '100.00',
              endPrice: '500.00'
            },
            {
              startPrice: '500.00',
              endPrice: '2000.00'
            },
            {
              startPrice: '2000.00',
              endPrice: '以上'
            }
          ],
          priceChecked: 'all',
          filterBy:false ,
          overLayFlag:false,
          sortFlag:1,
          page:1,
          pageSize:4,
          busy:true,
          mdShow:false,
          cartShow:false
        };
      },
      components:{
        appHeader,appFooter,Bread,Modal
      },
      mounted(){
        this.getGoodList() ;
      },
      methods:{
        getGoodList(flag=false){
          let params = {
            page:this.page ,
            pageSize:this.pageSize,
            sort:this.sortFlag,
            priceLevel:this.priceChecked
          };
          this.loading = true ;
          axios.get('/api/goods/list',{params}).then((res)=>{
            this.loading = false ;
            if(flag){
              this.goodsList = this.goodsList.concat(res.data.data) ;
              if(!res.data.data.length){
                this.busy = true ;
              }else{
                this.busy = false ;
              }
            }else{
              this.goodsList = res.data.data ;
              this.busy = false ;
            }
            console.log(this.goodsList);
          })
        },
        sortGoods(n){
          this.sortFlag = n ;
          this.page = 1 ;
          this.getGoodList() ;
        },
        loadMore(){
          this.busy = true;
          setTimeout(() => {
            this.page++ ;
            this.getGoodList(true) ;
            this.busy = false ;
          }, 600);

        },
        addCart(productId){
          axios.post('/api/goods/addCart',{productId}).then((res)=>{
            console.log(res) ;
            if(res.data.status==0){
              this.cartShow = true ;
            }else{
              this.mdShow = true ;
            }
          });
        },

        showFilterPop(){
          this.filterBy = true  ;
          this.overLayFlag = true  ;
        },
        closePop(){
          this.filterBy = false  ;
          this.overLayFlag = false  ;
        },
        setPriceFilter(index){
          this.priceChecked = index ;
          this.closePop() ;
          this.page=1 ;
          this.getGoodList() ;
        },
        closeModal(){
          this.mdShow = false ;
          this.cartShow =false ;
        }
      }
    }
</script>

<style scoped>

</style>
