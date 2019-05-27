<template>
    <div class="dialogMovingFolders">
        <!-- 选择文件夹 -->
        <el-dialog v-dialogDrag :title="$t('mxpcweb.mail.1528955118361')" :visible.sync="isOpen" custom-class="width620" :modal-append-to-body="false" :close-on-click-modal="false" >
            <div class="dialogBody MXscroll">
                <ul class="T_down" v-for="(item,index) in myMailTree" :key="index">
                    <fold-tree-menu v-if="Types==0||(Types==1&&item.boxId!=Id)" :treeData="item" :Types="Types" :currentId="Id" :isOpen="isOpen"></fold-tree-menu>
                </ul>
            </div>

            <div class="text-center">
                <!-- 取消 -->
                <el-button @click="cancelClick()">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                <!-- 确定 -->
                <el-button @click="submit()" type="primary" :loading="submitLoading" :style="checkedBoxid==-100?'background:rgba(208, 2, 27, 0.3);border: 1px solid transparent;':'' ">{{$t('mxpcweb.mail.1528942374762')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/12/11
 */
// import $ from 'jquery'
import FoldTreeMenu from './FoldTreeMenu'
import { mapGetters, mapMutations } from 'vuex'
import { isArray } from '@/libs/utils.js'
export default {
    name: 'DialogInDistribute',
    props: {

    },
    data() {
        return {
            isOpen: false, // 弹窗开关
            myMailTree: [],
            Idarry: [],
            Id: '',
            Types: '0', // 0-邮件移动   1-文件夹移动
            MovingCount: 0, // 移动数量
            submitLoading: false
        }
    },
    computed: {
        ...mapGetters([
            'company'
        ]),
        ...mapGetters('mail', [
            'checkedBoxid',
            'treeMenu',
            'typeMoving',
            'selectedBoxId',
            'subordinateCtid'
        ])
    },
    methods: {
        // 取消
        cancelClick() {
            this.isOpen = false
            this.set_typeMoving('')
        },
        // 父组件来调用
        isDialog(to, Idarry, count) {
            if (to == 'open') {
                this.Types = '0'
                this.isOpen = true
                this.Idarry = Idarry
                this.mailsMailboxesGet()
                this.MovingCount = count
            } else {
                this.isOpen = false
            }
        },
        isDialogMode(Id) {
            this.isOpen = true
            this.mailsMailboxesGet()
            this.Types = '1'
            this.Id = Id
            $('.dialogBody').find('.active').removeClass('active')
        },
        // 提交
        submit() {
            if (this.checkedBoxid == -100) {
                return
            }
            this.submitLoading = true
            let data = {}
            let url = ''
            if (this.Types == 0) {
                data = {
                    folder: this.checkedBoxid,
                    type: 'move',
                    mIds: this.Idarry
                }
                url = this.Global.baseURL + this.Global.api.Mail.mailPut
            } else {
                data = {
                    ctid: this.company.ctId,
                    action: 'remove',
                    boxId: this.Id,
                    targetBoxId: this.checkedBoxid
                }
                url = this.Global.baseURL + this.Global.api.Mail.mailsMailboxPut
            }
            if (this.subordinateCtid != this.company.ctId && this.subordinateCtid != 0) {
                data.ctid = this.subordinateCtid
            } else {
                delete data.ctid
            }
            this.$http.post(url, data).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    this.set_refurbishBool(1)
                    this.set_refurbishListBool(2)
                    this.isOpen = false // 关闭弹出框
                    this.submitLoading = false
                    // this.checkedBoxid = -100
                } else {
                    this.submitLoading = false
                    this.$message.error(this.msg(res.body))
                }
            },
                function (res) {
                    this.$message.error(this.$t(this.Global.errorTitle))
                })
        },
        // 清空表单
        resetForm(formName) {
            this.$refs[formName].resetFields()
        }, // 获取文件夹列表
        mailsMailboxesGet() {
            let ctid = this.company.ctId
            this.$http.get(this.Global.baseURL + this.Global.api.Mail.mailsMailboxesGet, {
                params: {
                    ctid: ctid
                }
            }).then(function (res) {
                if (res.body.code.toString() == this.Global.RES_OK && isArray(res.body.data)) {
                    this.myMailTree = [{
                        'boxPath': '',
                        'boxId': -2,
                        'boxName': '我的邮件',
                        'child': res.body.data
                    }]
                    this.set_checkedBoxid(-100)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, function (res) {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        ...mapMutations('mail', {
            set_typeMoving: 'SET_TYPEMOVING',
            set_refurbishBool: 'SET_REFURBISHBOOL',
            set_checkedBoxid: 'SET_CHECKEDBOXID',
            set_refurbishListBool: 'SET_REFURBISHLISTBOOL'
        })

    },
    components: {
        'fold-tree-menu': FoldTreeMenu

    },
    watch: {
        typeMoving: function (newValue, oldValue) {
            if (newValue != '') {
                this.isOpen = true
                this.mailsMailboxesGet()
                this.Types = '1'
                this.Id = newValue
                $('.dialogBody').find('.active').removeClass('active')
            }
        }
    }
}

</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
