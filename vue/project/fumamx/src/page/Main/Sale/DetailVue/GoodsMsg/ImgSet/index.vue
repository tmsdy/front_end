<template>
<!-- 图片列表 -->
<el-dialog class="ImgSet" v-dialogDrag :title="$t('mxpcweb.sale.components.1557564964743')" :visible.sync="dialogVisible" custom-class="width1020">
  <div class="ImgSetBox">
      <div class="largeImg">
          <div>
              <img :src="checkPic(largeImg, '400x400')" :nerror="defaultImg" alt="">
          </div>
      </div>
      <div class="smallImg">
          <div class="haveImg">
              <!-- 已选图片 -->
              <div class="title">{{$t('mxpcweb.sale.components.1557564964929')}}</div>
              <div class="listBox">
                    <div v-if="haveList.length == 0" class="list">
                        <img style="width:80px;height:80px;" :src="checkPic('', '80x80')" :onerror="defaultImg" alt="">
                    </div>
                    <template v-else>
                        <div class="list" v-for="(item, index) in haveList" :key="index" @click="largeImg = item">
                            <img style="width:80px;height:80px;" :src="checkPic(item, '80x80')" :onerror="defaultImg" alt="">
                            <div class="cover" v-if="index == 0">
                                <!-- 封面 -->
                                <span class="coverName">{{$t('mxpcweb.sale.components.1557564965118')}}</span>
                            </div>
                        </div>
                    </template>
              </div>
          </div>
      </div>
  </div>
  <span slot="footer" class="dialog-footer">
      <div style="text-align:center">
          <!-- 确 定 -->
        <el-button type="primary" @click="dialogVisible = false">{{$t('mxpcweb.sale.components.1557564964547')}}</el-button>
        <!-- 取 消 -->
        <el-button @click="dialogVisible = false">{{$t('mxpcweb.sale.components.1557564617043')}}</el-button>
      </div>
  </span>
</el-dialog>
</template>

<script>
export default {
    name: 'ImgSet',
    props: {
    },
    data() {
        return {
            dialogVisible: false,
            defaultImg: 'this.src="/static/images/goods/error.jpg"',
            haveList: [],
            largeImg: ''
        }
    },
    methods: {
        checkPic(imgId, type) {
            if (!imgId || imgId == '') {
                return '/static/images/goods/noImg.jpg'
            }
            return this.getGlobalImgSrc(imgId, type)
        },
        open(item, index) {
            this.haveList = []
            this.largeImg = ''
            if (item.imagesId) {
                item.imagesId.forEach((item, index) => {
                    this.haveList.push(item)
                    if (index == 0) {
                        this.largeImg = item
                    }
                })
            }
            this.dialogVisible = true
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
