<template>
    <div class="searchLabels">
        <div class="rightBox">
            <span :class="[check.length == 0 ? 'label2':'label1 hover']" @click="clearData()" class="noLabel">{{$t('mxpcweb.client.1529060999660')}}</span>
            <span v-for="item in options" :key="item.labelId"  class="label" :style="check.indexOf(item.labelId + '') != -1 ? '' : tagsBgColor(item.color)" :class="[check.indexOf(item.labelId + '') != -1 ? 'label2 hover':'label1 hover']" @click="changeItem(item.labelId + '')">{{item.labelName}}</span>
        </div>
    </div>
</template>

<script>

import { isArray, tagsBgColor } from '@/libs/utils.js'
export default {
    name: 'searchLabels',
    props: {
        list: {
            type: Object,
            default: function() {
                return {}
            }
        },
        moduleCode: {
            type: String,
            default: ''
        },
        optCode: {
            type: String,
            default: 'otView'
        }
    },
    data() {
        return {
            options: [],
            check: []
        }
    },
    created() {
    },
    mounted() {
        this.getTags()
    },
    methods: {
        tagsBgColor(color) {
            return tagsBgColor(color)
        },
        getTags() {
            let _this = this
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.label_get, {
                params: { searchType: 'list', moduleCode: _this.moduleCode }
            }).then(function (res) {
                _this.options = []
                _this.options = isArray(res.body.data) ? res.body.data : []
            })
        },
        clearData() {
            this.changeItem('')
        },
        changeItem(value) {
            let data = ''
            if (value == '') {
                this.check = []
            } else {
                if (this.check.indexOf(value) == -1) {
                    this.check.push(value)
                } else {
                    this.check.splice(this.check.indexOf(value), 1)
                }
                data = this.check.join(';')
            }
            this.$emit('update:controlData', data)
            let newValue = {
                key: this.list.fieldName,
                value: data
            }
            this.$emit('change', newValue, 'ver')
        },
        updata() {
            this.check = this.list.controlData.split(';')
        }
    },
    computed: {
    },
    watch: {
    },
    beforeDestroy: function () {
        this.options = null
        this.tagsBgColor = null
        this.getTags = null
        this.clearData = null
        this.changeItem = null
        this.updata = null
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.searchLabels{
    .rightBox{
        min-height: 36px;
        font-size:12px;
        .label,.noLabel{
            margin:4px 8px 4px 0;
            display: inline-block;
            padding: 3px 10px 4px;
            background: white;
            border-radius: 3px;
        }
        .label:hover{
            color: #d0021b;
            border:1px solid rgba(243,192,198,1);
            background:rgba(208,2,27,0.05);
        }
        .label1{
            border: 1px solid transparent;
            color: RGBA(96, 98, 102, 1);
        }
        .label2{
            border: 1px solid RGBA(208, 2, 27, 1);
            color: RGBA(208, 2, 27, 1);
        }
        .hover{
            &:hover{
                color: #E6001F!important;
                cursor: pointer;
                background: rgba(208,2,27,0.05)!important;
            }
        }
    }
}

</style>
