<template>
    <div class="FieldUpdate">
        <el-dialog v-dialogDrag title="字段更新" custom-class="width620" :visible.sync="dialogVisible" size="tiny" :before-close="handleClose" :close-on-click-modal="false" >
            <div class="fieldBox">
                <item ref="item" v-for="(item,index) in fieldArr" :item="item" :modules="modules" :key="index" :index="index" :fieldLen="fieldArr.length" @remove="removeItem(index)" @add="addItem()"></item>
                <transition name="el-zoom-in-top">
                    <p v-if="isErrorValue" class="tishi">请将内容填写完整</p>
                </transition>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sure()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Item from './Item'
export default {
    name: 'FieldUpdate',
    props: {
        modules: {
            type: Array,
            default: () => []
        },
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dialogVisible: false,
            isLoading: false,
            isErrorValue: false,
            fieldArr: [],
            tempFieldObj: { moduleCode: this.moduleCode, fieldId: '', fieldName: '', fieldValue: '', dictCode: '', controlTypeId: '' }
        }
    },
    created() {

    },
    methods: {
        removeItem(index) {
            this.fieldArr.splice(index, 1)
        },
        addItem() {
            this.fieldArr.push(Object.assign({}, this.tempFieldObj))
        },
        open() {
            this.fieldArr = []
            this.fieldArr.push(Object.assign({}, this.tempFieldObj))
            this.dialogVisible = true
        },
        sure() {
            // 验证
            let notPass = false
            this.$refs.item.forEach(item => {
                if (!item.checkData()) {
                    notPass = true
                }
            })
            if (notPass) {
                // 不通过
                this.isErrorValue = true
                setTimeout(() => {
                    this.isErrorValue = false
                }, 2000)
                return
            }
            this.$emit('sure', this.fieldArr)
            this.dialogVisible = false
            // 提交
        },
        handleClose(done) {
            done()
        }
    },
    components: {
        'item': Item
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
