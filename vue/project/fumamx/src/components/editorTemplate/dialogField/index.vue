<template>
    <div class="dialogFieldWrap" v-if="isShow">
        <div class="moduleBg" @click="isShow = false"></div>
        <div class="dialogField" :style="{left: focusGrid.x, top: focusGrid.y}">
            <el-select v-model="optionsVal" placeholder="请选择" @change="selectChange">
                <el-option v-for="item in options" :key="item.moduleCode" :label="item.showName" :value="item.moduleCode"> </el-option>
            </el-select>
            <ul class="MXscroll">
                <li v-for="(item, index) in pickDataArr" :key="index" @click="clickThis(item)">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'dialogField',
    props: {
        moduleCode: {
            type: String,
            default: 'allModule'
        },
        config: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            isShow: false,
            instance: null,
            key: null, // event.key
            options: [], // 选项
            optionsVal: 'Global', // 选中
            pickDataArr: [], // 选中对应的列表
            modulesArr: [], // 备选暂存
            // 全局字段，固定这里
            GlistData: [
                // {
                //   name: '地址簿昵称',
                //   fieldName: 'recipientName',
                //   moduleCode: 'Global'
                // },
                {
                    name: '收件人联系人名称',
                    fieldName: 'contName',
                    moduleCode: 'Global'
                },
                {
                    name: '收件人客户名称',
                    fieldName: 'custName',
                    moduleCode: 'Global'
                },
                {
                    name: '地址',
                    fieldName: 'address',
                    moduleCode: 'Global'
                },
                {
                    name: '公司名称',
                    fieldName: 'companyName',
                    moduleCode: 'Global'
                },
                {
                    name: '邮件',
                    fieldName: 'email',
                    moduleCode: 'Global'
                },
                {
                    name: 'logo',
                    fieldName: 'logo',
                    moduleCode: 'Global'
                },
                {
                    name: '手机',
                    fieldName: 'mobile',
                    moduleCode: 'Global'
                },
                {
                    name: '昵称',
                    fieldName: 'nickName',
                    moduleCode: 'Global'
                },
                {
                    name: '姓名',
                    fieldName: 'realName',
                    moduleCode: 'Global'
                },
                {
                    name: '标题',
                    fieldName: 'title',
                    moduleCode: 'Global'
                },
                {
                    name: '日期',
                    fieldName: 'currentDate',
                    moduleCode: 'Global'
                },
                {
                    name: '时间',
                    fieldName: 'currentTime',
                    moduleCode: 'Global'
                }
            ],
            backDataObj: {}, // 所选模块对应的模块
            focusGrid: {
                x: '', y: ''
            }
        }
    },
    created() { },
    methods: {
        clickThis(item) {
            this.instance.focus()
            // this.instance.execCommand('undo')
            let str = `{(${item.moduleCode}.${item.fieldName})!}`
            if (this.key && this.key !== '') {
                this.instance.execCommand('inserthtml', str)
            } else {
                this.instance.execCommand('inserthtml', '$' + str)
            }
            this.isShow = false
        },
        isOpen(instance, key) {
            // console.log(this.moduleCode)
            // console.log(this.config)
            // 营销写邮件时，才有这个
            if (this.config.moduleCode && this.config.moduleCode == 'EM001') {
            // if (this.moduleCode && this.moduleCode != 'EM001') {

            } else {
                 if (this.GlistData[0].fieldName != 'recipientName') {
                    this.GlistData.unshift({
                        name: '地址簿昵称',
                        fieldName: 'recipientName',
                        moduleCode: 'Global'
                    })
                }
            }
            this.instance = instance
            this.key = key
            this.isShow = true
            // 没有选项时，才加载接口
            if (this.options.length === 0) {
                this.getModules()
                this.pickDataArr = this.GlistData // 默认展示全局
            }

            // 下面计算坐标
            let domUtils = UE.dom.domUtils
            let bk_start = instance.selection.getRange().createBookmark().start // 创建一个临时dom，用于获取当前光标的坐标
            bk_start.style.display = '' // 设置临时dom不隐藏
            let ueOffset = ($('#' + instance.key).offset())
            let x = ueOffset.left + domUtils.getXY(bk_start).x
            let y = ueOffset.top + domUtils.getXY(bk_start).y + 75
            // console.log(UE)
            // 检查是否靠边了,修正位置
            let winWidth = document.body.clientWidth
            let minX = winWidth - 220
            x = x > minX ? minX : x // 不能超出浏览器了

            this.focusGrid = { x: x + 'px', y: y + 'px' }
            $(bk_start).remove() // 移除临时dom
        },
        selectChange(value) {
            if (value == 'Global') {
                this.pickDataArr = this.GlistData // 默认展示全局
                return
            }

            let pickObj = this.backDataObj[value] // 匹配所选的字段对象
            // 再把对象处理成数组放上
            let arr = []
            for (let i in pickObj) {
                arr.unshift({
                    name: i,
                    fieldName: pickObj[i].fieldName,
                    moduleCode: value
                })
            }
            this.pickDataArr = arr
        },
        // 模块下拉列表
        getModules() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.controlType, { params: { dataType: 'modules' } }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    // console.log(res.body.data)
                    let list = res.body.data.list

                    list.unshift({
                        moduleCode: 'Global',
                        showEnName: 'Global',
                        showName: '全局'
                    })
                    this.modulesArr = list

                    this.getData()
                } else {
                    this.$message.error(res.body.msg)
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        },
        // 当前模块所对应的数据
        getData() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.am_variables, { params: { moduleCode: this.moduleCode } }).then((res) => {
                if (res.body.code.toString() == this.Global.RES_OK) {
                    // console.log(res.body.data)
                    this.backDataObj = res.body.data

                    // 从所以下拉字段中匹配，当前状态模块号
                    let moduleOptionArr = []
                    Object.keys(this.backDataObj).forEach(item => {
                        this.modulesArr.forEach(item2 => {
                            if (item == item2.moduleCode) {
                                moduleOptionArr.push(item2)
                            }
                        })
                    })
                    this.options = moduleOptionArr
                } else {
                    this.$message.error(res.body.msg)
                }
            }, (res) => {
                this.$message.error(this.$t(this.Global.errorTitle))
            })
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.dialogFieldWrap {
    .moduleBg {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 3000;
    }
    .dialogField {
        // border:1px solid red;
        position: fixed;
        // left: 50%;
        // top: 50%;
        z-index: 3001;
        width: 220px;
        padding: 10px;
        background: rgb(68, 68, 68);
        border-radius: 4px;
        text-align: center;
        > ul {
            max-height: 222px;
            overflow: auto;
            margin-top: 10px;
            li {
                // border:1px solid blue;
                color: #fff;
                padding: 8px 15px;
                text-align: left;
                &:hover {
                    background: #5c5c5c;
                    cursor: pointer;
                }
            }
        }
    }
}
// @import "./zh-cn.less";
// @import "./en.less";
</style>
