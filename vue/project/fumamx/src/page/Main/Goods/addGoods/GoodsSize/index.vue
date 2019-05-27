<template>
<div class="Controls-Size">
    <span class="title" :style="{'width': '100px'}">{{itemData.cnFieldCaption}}</span>
    <el-checkbox-group v-model="checkList" @change="change">
        <div class="spanList" v-for="(item, index) in baseList" :key="index" v-show="item.inUse=='1'">
            <el-checkbox :label="item.dictItemCode + ''">{{item.itemName + ''}}</el-checkbox>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <!-- 备注 -->
            <el-input style="width:60px;" v-show="isCheck(item.dictItemCode)" :placeholder="$t('mxpcweb.PP001.PP001List.1543302573547')" v-model="item.remarks"></el-input>
        </div>
        <div class="spanList">
            <!-- 自定义 -->
            <el-input style="width:150px;" :placeholder="$t('mxpcweb.PP001.PP001List.1543302476771')+itemData.cnFieldCaption" v-model="autoRemarks">
                <el-button slot="append" icon="plus" @click="addOption()"></el-button>
            </el-input>
        </div>
    </el-checkbox-group>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Controls-Size',
    props: {
        itemData: {
            type: Object,
            default: function() {
                return {}
            }
        },
        items: {
            type: Object,
            default: function() {
                return {}
            }
        },
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            checkList: [],
            baseList: [],
            baseListBase: [],
            autoRemarks: '',
            autoNum: 0
        }
    },
    created() {
        this.getData()
    },
    mounted() {
    },
    computed: {
        ...mapGetters([
        'sysBoxValue'
        ])
    },
    methods: {
        addOption() {
            if (this.autoRemarks != '') {
                let data = {
                    dictItemCode: 'auto' + this.autoNum,
                    itemName: this.autoRemarks,
                    remarks: '',
                    inUse: '1'
                }
                this.baseList.push(data)
                this.autoNum = this.autoNum + 1
                this.autoRemarks = ''
            }
        },
        isCheck(code) {
            let isHave = false
            this.checkList.forEach(element => {
                if (element == code) {
                    isHave = true
                }
            })
            return isHave
        },
        updatas(value) {
            let list = value && value != '' ? value : []
            let options = this.baseListBase
            list.forEach(element => {
                let isHave = false
                options.forEach(elements => {
                    if (elements.dictItemCode == element.dictItemCode) {
                        isHave = true
                    }
                })
                if (!isHave) {
                    options.push(element)
                    this.autoNum = this.autoNum + 1
                }
            })
            this.baseList = options
            this.baseListBase = options
            let checkList = []
            if (list.length > 0) {
                list.forEach(item => {
                    checkList.push(item.dictItemCode + '')
                })
                list.forEach(item => {
                    this.baseList.forEach(element => {
                        if (item.dictItemCode + '' == element.dictItemCode + '') {
                            element.remarks = item.remarks
                        }
                    })
                })
            }
            this.checkList = checkList
            this.change()
        },
        updata() {
            let list = this.itemData.fieldValue && this.itemData.fieldValue != '' ? this.itemData.fieldValue : []
            let checkList = []
            if (list.length > 0) {
                list.forEach(item => {
                    checkList.push(item.dictItemCode + '')
                })
                list.forEach(item => {
                    this.baseList.forEach(element => {
                        if (item.dictItemCode + '' == element.dictItemCode + '') {
                            element.remarks = item.remarks
                        }
                    })
                })
            }
            this.checkList = checkList
            this.change()
        },
        submitForm() {
            let data = {}
            data[this.itemData.fieldName] = this.returnList()
            return data
        },
        returnList () {
            let list = []
            this.baseList.forEach(element => {
                this.checkList.forEach(item => {
                    if (element.dictItemCode == item) {
                        list.push(element)
                    }
                })
            })
            return list
        },
        getData () {
            let options = []
            if (this.sysBoxValue instanceof Array) {
                this.sysBoxValue.forEach(element => {
                if (element.dictCode == this.itemData.dictCode) {
                    element.dictItems.forEach(item => {
                        options.push(item)
                    })
                }
                })
            }
            options.forEach(element => {
                element.remarks = ''
            })
            if (this.type == 'edit') {
                this.items[this.itemData.fieldName].forEach(element => {
                    let isHave = false
                    options.forEach(elements => {
                        if (elements.dictItemCode == element.dictItemCode) {
                            isHave = true
                        }
                    })
                    if (!isHave) {
                        options.push(element)
                        this.autoNum = this.autoNum + 1
                    }
                })
            }
            this.baseList = options
            this.baseListBase = options
        },
        change() {
            this.$emit('sizeChange', this.returnList())
        }
    },
    components: {
    },
    watch: {
        itemData(val) {
            this.getData()
        }
    }
}
</script>
<style lang="less">
.el-button--default{
    background: white;
}
.el-icon-plus{
    font-weight: 400;
}
</style>

<style lang="less" rel="stylesheet/less" scoped>
.Controls-Size{
    min-height: 36px;
    margin-bottom: 10px;
    padding-left: 100px;
    position: relative;
    .title{
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
    }
    .spanList{
        display: inline-block;
        width: 300px;
        height: 44px;
    }
}
</style>
