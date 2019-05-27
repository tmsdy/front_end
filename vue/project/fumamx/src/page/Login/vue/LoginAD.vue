<template>
  <div class="LoginAD" v-loading="isLoading">
    <el-carousel v-if="tableData3.length>0" :height="sliderHeight" arrow="never" :interval="8000">

      <el-carousel-item v-for="(item, index) in tableData3" :key="index">
        <div class="content">
          <dl>
            <dd>
              <img class="text-hover" :src="getGlobalImgSrc(item.pictureCode)" @click="goLink(item)" alt="孚盟MX" />
            </dd>
          </dl>
        </div>
      </el-carousel-item>

    </el-carousel>
    <!-- 后台图片管理为空时 -->
    <div v-else class="defaultImg">
      <img src="https://sf.fumamx.com/img/orig/3,3f8bc16c81c0" alt="MX"/>
    </div>
  </div>
</template>

<script>
import { isArray } from '@/libs/utils.js'
export default {
  name: 'LoginAD',
  data() {
    return {
      isLoading: true,
      sliderHeight: '555px',
      tableData3: []
    }
  },
  created() {
    this.getListData()
  },
  mounted() {
    setTimeout(() => {
      this.getWinHeight()
    }, 200)
    $(window).resize(() => {
      this.getWinHeight()
    })
  },
  methods: {
    getWinHeight() {
      let winHeight = document.body.clientHeight
      this.sliderHeight = winHeight + 'px'
    },
    goLink(item) {
      if (item.url && item.url !== '') {
        this.openNewWindowTab(item.url) // 跳转
      } else {
        console.log(' 无链接 ')
      }
    },
    // 查列表数据
    getListData() {
      this.$http
        .get(this.Global.baseURL + this.Global.api.v2.imgManage, {})
        .then(
          res => {
            this.isLoading = false
            if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
              this.tableData3 = res.body.data
              // this.tableData3.length = 1
              // console.log(this.tableData3)
            } else {
              this.$message.error(res.body.msg)
            }
          },
          res => {
            this.$message.error(this.$t(this.Global.errorTitle))
          }
        )
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.LoginAD {
  width: 100%;
  height: 100%;
  .el-carousel__indicators {
    margin-bottom: 33px;
  }
  .defaultImg {
    // border: 1px solid black;
    height: 100%;
    display:flex;
    align-items: center;
    justify-content:center;
    background: linear-gradient(360deg, rgb(255, 153, 165) 0%, rgb(234, 60, 81) 100%);
  }
  .content {
    // border: 1px solid black;
    height: 100%;
    // display:flex;
    // align-items: center;
    // justify-content:center;
    text-align: center;
    color: #fff;
    >dl{
      text-align: center;
      margin-bottom: -45px;
      img {
        width: 100%;
        // border:1px solid black;
      }
      dt{
        font-size: 32px;
        margin-bottom: 5px;
      }
      dd {
        font-size: 17px;
        line-height: 28px;
      }
    }
  }
}
</style>
