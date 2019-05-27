<template>
    <div class="editGoods">
        <ul class="goodsList">
            <li v-for="(item, index) in goodsList" :key="index">
                <img :src="checkPic(item)">
                <span class="delGoods" @click="delGoods(index, item)"><i class="iconfont icon-close"></i></span>
            </li>
            <li class="text-hover" @click="$refs.goodsAdd.open()">选择商品</li>
            <div class="clearfix"></div>
        </ul>

        <el-form label-width="80px" label-position="left">
            <!-- 显示样式 -->
            <el-form-item class="itemBox" label="显示样式">
                <el-radio-group v-model="goodsShowStyle" @change="goodsEmit">
                    <el-radio :label="1">卡片样式</el-radio>
                    <el-radio :label="2">列表样式</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 显示内容 -->
            <el-form-item class="itemBox" label="显示内容">
                <!-- <el-checkbox v-model="checked">显示商品简介</el-checkbox> -->
                <el-checkbox-group v-model="goodsShowContent" @change="goodsEmit">
                    <el-checkbox label="1">商品简介</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>

        <!-- 添加商品 -->
        <goods-add ref="goodsAdd" title="选择商品" :isReturnData="true" @add="addGoods" :selData="goodsList" />
    </div>
</template>

<script>
import goodsAdd from '@/components/goodsAdd' // 添加商品
export default {
  name: 'editGoods',
  props: {
    goodsDom: {
        type: Object,
        default: function() {
            return {}
        }
    }
  },
  data () {
    return {
        goodsList: [],
        goodsShowStyle: 1,
        goodsShowContent: ['1']
    }
  },
  methods: {
      checkPic(item) {
            // console.log(item)
            let imgId
            if (!item.imagesId || item.imagesId.length === 0) {
                return '/static/images/goods/noImg.jpg'
            } else {
                imgId = item.imagesId[0] // 取第一个数组项为默认头像
                return this.getGlobalImgSrc(imgId, '55x55')// 裁剪成正方形
            }
        },
      delGoods(index, item) {
          console.log(item)
        //   console.log(this.getGoodsLink(item.spuId))
        this.goodsList.splice(index, 1)
        this.goodsEmit()
      },
      addGoods(list, arr) {
        let allArr = this.goodsList.concat(list)
        let obj = {}
        allArr = allArr.reduce((cur, next) => {
            if (!obj[next.spuId]) {
                obj[next.spuId] = true && cur.push(next)
            }
            return cur
        }, []) // 设置cur默认类型为数组，并且初始值为空的数组

        // 加上链接
        allArr.forEach(item => {
            item.spuLink = this.getGoodsLink(item.spuId)
            // 加上金额单位
            arr.forEach(item2 => {
                if (item2.currencyCode == item.saleCur) {
                    item.salePrice = item2.symbol + item.salePrice
                }
            })
        })
        this.goodsList = allArr
        this.goodsEmit()
      },
      goodsEmit() {
        if (this.goodsList.length === 0) { return }
        this.$emit('change', this.goodsList, {
            imgBlobalUrl: this.Global.imgBaseSrc,
            goodsShowStyle: this.goodsShowStyle,
            goodsShowContent: this.goodsShowContent
        })
      }
  },
  components: {
    'goods-add': goodsAdd
  },
  watch: {
      goodsDom: {
        handler(newName, oldName) {
            console.log('obj changed')
            console.log(newName)
            this.goodsList = []
        },
        immediate: true,
        deep: true
      }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
