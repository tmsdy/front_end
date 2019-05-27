<template>
    <ul class="editPic">
        <li v-for="(item,index) in attachments" :key="index">
            <img v-if="item[0].url === ''" width="90" src="https://sf.fumamx.com/img/orig/2,3d77417a2c0b">
            <img v-else :src="item[0].url">
            <file-upload class="pickPic" ref="picComponent" :showList="false" :limitSize="2" @change="pickPicChange" :multiple="false" accept="image/jpeg,image/jpg,image/png,image/gif">
                <el-button slot="trigger" size="mini" type="text" @click="doIndex = index; item[0].link = ''; item[0].showLink = false">
                    <!-- 浏览 -->
                    <span v-if="item[0].url === ''">{{$t('fumamx-web-templateeditor.1531901538927')}}</span>
                    <!-- 替换 -->
                    <span v-else>{{$t('fumamx-web-templateeditor.1531901513280')}}</span>
                </el-button>
            </file-upload>
            <template v-if="item[0].url && item[0].url !== ''">
                <el-tooltip class="item" effect="dark" content="点击图片跳转的链接地址" placement="top">
                    <el-button size="mini" :type="item[0].showLink ? '' : 'text'" @click="item[0].showLink = true">链接</el-button>
                </el-tooltip>
                <div class="linkInput" v-if="item[0].showLink">
                    <el-input v-model="item[0].link" placeholder="http://"></el-input>
                    <el-button size="small" type="" @click="doIndex = index; update(); item[0].showLink = false">保存</el-button>
                    <el-button size="small" type="" @click="item[0].link = ''; item[0].showLink = false">取消</el-button>
                </div>
            </template>
        </li>
    </ul>
</template>

<script>
import FileUpload from '@/components/FileUpload/index' // 文件上传
export default {
  name: 'editGoods',
  props: {
      attachments: {
          type: Array,
          default: function() {
              return []
          }
      }
  },
  data () {
    return {
        doIndex: -1, // 当前选择的图片index
        doPic: []
    }
  },
  methods: {
    // 父来调，打开选图片
    pickPic(index) {
        this.$refs.picComponent[index].click()
        this.doIndex = index
    },
    // 控件处，更新图片展示
    pickPicChange(val) {
        this.doPic = val
        if (this.doIndex == -1) {
            console.log('doIndex == -1')
            return
        }
        // console.log(val)
        // 更新对应图片
        var picObj = val[val.length - 1] // 原为追加的，故取最后一个
        let url = this.getGlobalImgSrc(picObj.url, '70x70')
        this.attachments[this.doIndex][0].url = url

        this.update() // 更新iframe图片
    },
    update() {
        // 更新iframe图片
        let val = this.doPic[this.doPic.length - 1]
        this.$emit('change', {
            name: val.name,
            url: this.getGlobalImgSrc(val.url),
            link: this.attachments[this.doIndex][0].link,
            index: this.doIndex
        })
        this.$message.success('图片信息已更新')
    }
  },
  components: {
        'file-upload': FileUpload
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.editPic {
    >li {
        // border:1px solid red;
        padding-left: 15px;
        margin-bottom: 15px;
        min-height: 80px;
        line-height: 50px;
        border-bottom: 1px solid #ddd;
        position: relative;
        .linkInput {
            // border:1px solid red;
            line-height: 1rem;
            position: absolute;
            left: 138px;
            bottom: 5px;
            right: 8px;
            .el-input {
                width: 230px;
                position: relative;
                top: -4px;
            }
            .el-button{
                // border:1px solid transparent;
                margin-left: 3px;
            }
        }
        >img{
            height: 70px;
            float: left;
            margin-right: 10px;
        }
        .el-button {
            // border:1px solid blue;
            padding-left: 8px;
            padding-right: 8px;
            position:relative;
            top:-5px;
            margin-left: 3px;
        }
        .pickPic{
            float: left;
        }
    }
}
</style>
