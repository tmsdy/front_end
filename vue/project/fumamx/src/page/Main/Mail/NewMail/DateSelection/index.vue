<template>
    <div class="DateSelection">
        <template>
            <!-- '定时发送':'延时发送' -->
            <el-dialog v-dialogDrag :title="showType==0?$t('mxpcweb.mail.1528786189128'):$t('mxpcweb.mail.1528786238556')" :visible.sync="isOpen" custom-class="width520" @close="resetForm('dialogForm')" :modal-append-to-body="false" :close-on-click-modal="false" >
                <el-form ref="dialogForm" label-width="80px">
                    <!-- 发送时间 -->
                    <el-form-item :label="$t('mxpcweb.mail.1528954830603')" v-if="showType==0">
                        <!-- 请选择时间 -->
                        <el-date-picker v-model="datetime" align="center" type="datetime" @change="change" format="yyyy-MM-dd HH:mm" :placeholder="$t('mxpcweb.mail.1528954832282')" :picker-options="pickerOptions" class="widthFull"> </el-date-picker>
                    </el-form-item>
                    <!-- 延迟时间 -->
                    <el-form-item :label="$t('mxpcweb.mail.1528954832528')" v-if="showType==1">
                        <!-- 请选择 -->
                        <el-select v-model="value" :placeholder="$t('mxpcweb.mail.1528884704820')" class="widthFull">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>

                    </el-form-item>
                    <div class="text-center">
                        <!-- 取消 -->
                        <el-button @click="resetForm('dialogForm')">{{$t('mxpcweb.mail.1528942364802')}}</el-button>
                        <!-- 确定 -->
                        <el-button @click="submit('dialogForm')" :loading="submitLoading" type="primary">{{$t('mxpcweb.mail.1528942374762')}}</el-button>
                    </div>
                </el-form>
            </el-dialog>
        </template>
    </div>
</template>

<script>
import {
    mapGetters
} from 'vuex'

/**
 * 描述：邮件部分
 * 作者：向士健(CSS) / ***(API)
 * 时间：2017/11/11
 */
export default {
    name: 'DateSelection',
    props: {

    },
    data() {
        let _this = this
        return {
            isOpen: false,
            datetime: '',
            deliveryTime: '',
            title: '',
            label: '',
            showType: 0,
            value: '', // 延迟时间
            urlstr2: '',
            pickerOptions: {
                shortcuts: [{
                    text: _this.$t('mxpcweb.mail.1528975810590'), // '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: _this.$t('mxpcweb.mail.1528955004333'), // '明天',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: _this.$t('mxpcweb.mail.1528955067857'), // '一周后',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },
            options: [{
                value: '10',
                label: '10' + _this.$t('mxpcweb.mail.1528975813794')// '10分钟'
            },
            {
                value: '30',
                label: '30' + _this.$t('mxpcweb.mail.1528975813794')// '30分钟'
            },
            {
                value: '60',
                label: '60' + _this.$t('mxpcweb.mail.1528975813794')// '60分钟'
            },
            {
                value: '120',
                label: '120' + _this.$t('mxpcweb.mail.1528975813794')// '120分钟'
            }, {
                value: '240',
                label: '240' + _this.$t('mxpcweb.mail.1528975813794')// '240分钟'
            }, {
                value: '360',
                label: '360' + _this.$t('mxpcweb.mail.1528975813794')// '360分钟'
            }
            ],
            ParameterData: {},
            sendTo: true,
            submitLoading: false

        }
    },
    mounted() {
        this.datetime = new Date()
    },
    methods: {
        // 父组件来调用   type 0定时  1延时
        isDialog(to, type, ParameterData, urlstr, sendTo) {
            if (to == 'open') {
                this.isOpen = true
                this.showType = type
                this.urlstr2 = urlstr
                this.ParameterData = ParameterData
                this.sendTo = sendTo
            } else {
                this.isOpen = false
            }
        },
        change(newValue) {
            this.deliveryTime = newValue
        },
        // 提交
        submit(formName) {
            this.submitLoading = true
            // let _this = this
            let sendTime = 0
            // type 0定时  1延时
            if (this.showType == 0) {
                this.ParameterData.deliverDate = this.$m_unifiedTime(this.datetime)
                sendTime = this.datetime.getTime()
            } else {
                sendTime = new Date().getTime() + this.value * 1000 * 60
                this.ParameterData.deliverDate = this.$m_unifiedTime(sendTime)
            }
            let curTime = new Date().getTime()
            if (sendTime <= curTime) {
                this.$message.error(this.$t('mxpcweb.mail.1528975846871'))// 发送时间不能小于当前时间！
                this.submitLoading = false
                return
            }
            // this.ParameterData.deliverDate = this.$m_unifiedTime(curTime = new Date().getTime() + 60000);
            // console.log(this.ParameterData.deliverDate);
            if (this.sendTo) { // 一对一定时
                this.ParameterData.type = 1
                this.$emit('openOneToOneDialog', this.ParameterData.deliverDate)
                this.submitLoading = false
                // ep.emit("closeMailTab", this.urlstr2);
                return
            }
            // console.log(this.ParameterData.deliverDate)
            let deliverDate = this.ParameterData.deliverDate
            // type 0定时  1延时
            if (this.showType == 0) {
                this.submitLoading = false
                this.$emit('timingChange', 'ordinary', deliverDate)
            } else {
                this.submitLoading = false
                this.$emit('delayedChange', 'ordinary', deliverDate)
            }
        },
        // 清空表单
        resetForm(formName) {
            this.isOpen = false
            this.$refs[formName].resetFields()
        }
    },
    computed: {
        ...mapGetters([
            'individualConfigInfo',
            'company'
        ])
    }
}

</script>
