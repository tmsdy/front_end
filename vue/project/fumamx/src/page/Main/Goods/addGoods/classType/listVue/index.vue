<template>
    <div class="classSearch">
        <div class="classSearchBox">
            <el-input :placeholder="placeholder" icon="search" v-model="keywords" @keyup.enter.native="getListData" @blur="getListData" :on-icon-click="getListData"></el-input>
        </div>
        <div class="classContent MXscroll" :id="'classContentList' + type" ref="classContentList">
            <div class="list text-hover ellipsis" :ref="'item' + item.catgId" :class="listCheck==item.catgId?'list1':''" v-for="(item, index) in dataList" :key="index" @click="check(item)">
                {{item.display}}
                <span class="select" v-if="item.categoryList && item.categoryList.length>0">
                    <i class="iconfont icon-page-right"></i>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'addSP',
    props: {
        list: {
            type: Array,
            default: function() {
                return []
            }
        },
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 一级分类：名称检索
            // 二级分类：名称检索
            // 三级分类：名称检索
            placeholders: [this.$t('mxpcweb.PP001.PP001List.1540348105177'), this.$t('mxpcweb.PP001.PP001List.1540348109797'), this.$t('mxpcweb.PP001.PP001List.1540348114295')],
            placeholder: '',
            keywords: '',
            listBase: [],
            dataList: [],
            listCheck: ''
        }
    },
    created() {
        if (this.type == '1') {
            this.placeholder = this.placeholders[0]
        }
        if (this.type == '2') {
            this.placeholder = this.placeholders[1]
        }
        if (this.type == '3') {
            this.placeholder = this.placeholders[2]
        }
    },
    mounted() {
        this.unit()
    },
    methods: {
        updata (value) {
            let obj = {
                catgId: value,
                categoryList: this.returnList(value)
            }
            this.check(obj)
            let offsetTop = this.$refs['item' + value][0] ? this.$refs['item' + value][0].offsetTop : this.$refs['item' + value].offsetTop
            let classContentListTop = this.$refs.classContentList.offsetTop
            $('#classContentList' + this.type).scrollTop(offsetTop - classContentListTop - 100)
        },
        check(item) {
            this.listCheck = item.catgId
            this.$emit('check', this.type, item.categoryList)
        },
        submit() {
            return this.listCheck
        },
        unit() {
            let list = []
            this.list.forEach(item => {
                list.push(item)
            })
            this.listCheck = ''
            this.$emit('check', this.type, [])
            this.listBase = list
            this.dataList = list
        },
        getListData() {
            if (this.keywords == '') {
                this.dataList = this.listBase
                return false
            }
            let list = []
            this.listBase.forEach(element => {
                if (element.display.indexOf(this.keywords) != -1) {
                    list.push(element)
                }
            })
            this.dataList = list
            if (!this.checkHave()) {
                this.listCheck = ''
                this.$emit('check', this.type, [])
            }
        },
        checkHave() {
            let isHave = false
            this.dataList.forEach(element => {
                if (element.catgId == this.listCheck) {
                    isHave = true
                }
            })
            return isHave
        },
        returnList(value) {
            let list = []
            this.dataList.forEach(element => {
                if (element.catgId == value) {
                    list = element.categoryList
                }
            })
            return list
        }
    },
    watch: {
        list() {
            this.unit()
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.classSearch{
    border-right: 1px solid #DFE2E4;
    width: 49%;
    float: left;
    height: 100%;
    .classSearchBox{
        padding: 10px 20px;
    }
    .classContent{
        height: 326px;
        overflow: auto;
        .list{
            height:40px;
            line-height:40px;
            padding: 0px 30px 0px 20px;
            position: relative;
            .select{
                position: absolute;
                right: 20px;
            }
            &:hover{
                background: #FCF2F3;
            }
        }
        .list1{
            background:rgba(252,242,243,1);
            color: #d0021b;
        }
        &.hover{
            overflow: auto;
        }
    }
}
.classSearch:last-child{
    border-right: 0;
}
</style>
