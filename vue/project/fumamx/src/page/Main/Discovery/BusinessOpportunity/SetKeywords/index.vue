/*
 * Discription: 发现商机•设置关键词弹框
 * -----
 * Created Date: Wednesday, 6th March 2019 4:22:39 pm
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: Thursday, 7th March 2019 11:14:58 am
 * Modified By: name (email)
 */

<template>
    <el-dialog v-dialogDrag custom-class="SetKeywords width620" title="设置关键词" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose">
        <p class="hint">为了给您推荐有效的询盘信息，请您设置对应关键词（为扩大搜索范围建议关键词相对宽泛，不要出现型号），最多可设置10个。</p>
        <div class="inputBox">
            <el-input class="input" type="text" placeholder="输入产品关键词" @keyup.enter.native="addKeywords()" v-model="keywords">
            </el-input>
            <el-button :loading="isAdding" class="btn pull-right" type="primary" @click="addKeywords()">添加</el-button>
        </div>
        <ul v-if="!isLoading" class="keywordsBox clearfix">
            <li v-for="(item,index) in resKeywords" :key="index">
                <span @click="deleteKeywords(item,index)" class="close-btn iconfont icon-close-bold"></span>
                {{item.keyword}}
            </li>
        </ul>
        <loading v-if="isLoading"></loading>
    </el-dialog>
</template>

<script>
import { hasHan } from '@/libs/utils.js'
import Loading from '@/basecomponents/Loading/index'
export default {
    name: 'SetKeywords',
    data() {
        return {
            isLoading: false,
            isAdding: false,
            dialogVisible: false,
            keywords: '',
            resKeywords: []
        }
    },
    methods: {
        open() {
            this.dialogVisible = true
            this.getKeywords()
        },
        handleClose(done) {
            done()
        },
        async addKeywords() {
            if (!this.keywords || this.isAdding) {
                return
            }
            if (hasHan(this.keywords)) {
                this.$alert('不能包含中文', '注意', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                })
                return
            }
            /*  let reg = /[\u4e00-\u9fa5]/g
             if (reg.test(this.keywords)) {
                 this.$alert('不能包含中文', '注意', {
                     confirmButtonText: '确定',
                     callback: action => {

                     }
                 })
                 return
             } */

            this.isAdding = true
            try {
                const url = this.Global.baseURL + this.Global.api.v2.find_inquiryKeywords
                let data = { keywords: this.keywords }
                this.keywords = ''
                let res = await this.$http.put(url, data)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.getKeywords()
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isAdding = false
        },
        async deleteKeywords(item, index) {
            try {
                this.resKeywords.splice(index, 1)
                const url = this.Global.baseURL + this.Global.api.v2.find_inquiryKeywords
                let body = { id: item.id }
                let res = await this.$http.delete(url, { body })

                if (res.body.code.toString() === this.Global.RES_OK) {
                    /* TODO:移除数组中的该项 */
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                this.$message.error(this.$t(this.Global.errorTitle))
            }
        },
        async getKeywords() {
            try {
                this.isLoading = true
                const url = this.Global.baseURL + this.Global.api.v2.find_inquiryKeywords
                let res = await this.$http.get(url)
                if (res.body.code.toString() === this.Global.RES_OK) {
                    this.resKeywords = res.body.data || []
                } else {
                    this.$message.error(this.msg(res.body))
                }
            } catch (error) {
                console.log(error)
                this.$message.error(this.$t(this.Global.errorTitle))
            }
            this.isLoading = false
        }
    },
    components: {
        'loading': Loading
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
