<template>
    <div class="DragDialog" v-show="isShow">
        <span class="close text-hover" @click="isShow = false"><i class="iconfont icon-close"></i></span>
        <span class="before" v-show="!showTip">拖动文件到此区域</span>
        <span class="after" v-show="showTip">拖进后松开鼠标</span>
    </div>
</template>

<script>
/**
 * 描述：文件上传UI封装
 * 作者：向士健
 * 时间：2019/1/29
 */
export default {
    name: 'DragDialog',
    props: {
        // 限制所选文件大小
        limitSize: {
            type: Number,
            default: 10
        },
        spatial: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isShow: false,
            // isShow: true,
            showTip: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$parent.$el.parentNode.after(this.$el)
            this.checkDrag()
        })
    },
    methods: {
        // 有拖拽进来松开时
        checkDrag() {
            let _this = this
            $(document).on({
                dragleave: function (e) {
                    e.preventDefault()
                    setTimeout(() => {
                        if (_this.isShow) {
                            _this.isShow = false
                        }
                    }, 2000)
                },
                drop: function (e) { // 松开
                    e.preventDefault()
                },
                dragenter: function (e) {
                    e.preventDefault()
                    if (!_this.isShow) {
                        _this.isShow = true
                    }
                },
                dragover: function (e) {
                    e.preventDefault()
                }
            })
            this.$el.addEventListener('dragenter', (e) => {
                _this.showTip = true
            })
            this.$el.addEventListener('dragleave', (e) => {
                _this.showTip = false
            })
            this.$el.addEventListener('drop', (e) => {
                e.preventDefault()
                let files = e.dataTransfer.files

                if (files.length === 0) { return }

                // 检测文件大小限制，并复制一份待用
                let newFiles = []
                let countM = 0
                for (var i = 0; i < files.length; i++) {
                    let fileSize_M = (files[i].size / 1048576).toFixed(2) // 转成M，并保存2位小数

                    if (fileSize_M > this.limitSize) {
                        this.$message.warning('包含超过 ' + this.limitSize + ' M的文件不能上传')
                        return
                    }
                    countM = countM + fileSize_M
                    newFiles.push(files[i])
                }
                if (this.spatial > 0) {
                    let Surplus = this.SpatialQuery()
                    if (countM > Surplus) {
                        this.$message.warning('空间不足，无法导入')
                        return
                    }
                }

                _this.$emit('change', newFiles)
                _this.isShow = false
            })
        }
    }
}
</script>

<style lang="less" ref="stylesheet/less" scoped>
@import "./zh-cn.less";
</style>
