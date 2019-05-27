<template>
    <div class="searchLabels">
        <div class="rightBox">
            <span :class="[check === '' ? 'label2':'label1 text-hover']" @click="clearData()" class="noLabel">{{$t('mxpcweb.client.1529060999660')}}</span>
            <template v-if="list.fieldGroup == 0">
                <span v-if="list.controlTypeId==2">
                    <template v-for="item in options">
                        <span v-if="item.inUse == '1'" :key="item.dictItemCode"  class="label" :class="[check == item.dictItemCode+'' ? 'label2':'label1 text-hover']" @click="changeItem(item.dictItemCode)">{{item.itemName}}</span>
                    </template>
                </span>
                <span v-else-if="list.controlTypeId=='tags'">
                    <span v-for="item in options" :key="item.labelId"  class="label" :style="tagsBgColor(item.color)" :class="[check == item.labelId+'' ? 'label2':'label1 text-hover']" @click="changeItem(item.labelId)">{{item.labelName}}</span>
                </span>
                <component class="control" v-else v-bind:is="'control'+list.controlTypeId"  :optCode="optCode"  :moduleCode="moduleCode"  ref="control" @change="change" labelWidth="0" :isProp="true" :showLabel="false" rightWidth="120px" :controlData.sync="list.controlData" :itemData="list" size="mini"></component>
            </template>
            <template v-else>
                <component class="control" v-bind:is="'group'+list.fieldGroup"  :optCode="optCode"  :moduleCode="moduleCode"  ref="control"  :isProp="true"  @change="change"  rightWidth1='120px' rightWidth='245px'  labelWidth="0" :itemData="list" :showLabel="false"  size="mini"></component>
            </template>
        </div>
    </div>
</template>

<script>

import Controls from '@/components/Controls/index.js'
import GroupControls from '@/components/GroupControls/index.js'
import { mapGetters } from 'vuex'
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
            check: ''
        }
    },
    created() {
    },
    mounted() {
        let time = setTimeout(() => {
            if (this.list.controlTypeId == 2) {
                this.getFieldData()
            }
            window.clearTimeout(time)
        }, 20)
        if (this.list.controlTypeId == 'tags') { this.getTags() }
    },
    methods: {
        tagsBgColor(color) {
            return tagsBgColor(color)
        },
        getTags() {
            this.$http.get(this.Global.baseURL + this.Global.api.v2.label_get, {
                params: { searchType: 'list', moduleCode: this.moduleCode }
            }).then((res) => {
                this.options = []
                this.options = isArray(res.body.data) ? res.body.data : []
            })
        },
        clearData() {
            if (this.list.controlTypeId == 2 || this.list.controlTypeId == 'tags') {
                this.changeItem('')
            } else {
                this.$refs['control'].clearData()
                let time = setTimeout(() => {
                    this.check = ''
                    window.clearTimeout(time)
                }, 20)
            }
        },
        changeItem(value) {
            this.$emit('update:controlData', value)
            if (this.check !== value) {
                this.check = value
                let newValue = {
                    key: this.list.fieldName,
                    value: value
                }
                this.$emit('change', newValue, 'ver')
            }
        },
        getFieldData() {
            if (isArray(this.sysBoxValue) && this.sysBoxValue != undefined) {
                this.sysBoxValue.forEach(element => {
                    if (element.dictCode == this.list.dictCode) {
                        this.options = []
                        this.options = element.dictItems
                    }
                })
            }
        },
        change(value) {
            if (value.value != '' || (value.data && value.data.value != '')) {
                this.check = value
            } else {
                this.check = ''
            }
            let newValue
            if (value.key) {
                newValue = {
                    key: value.key,
                    value: value.value == undefined ? '' : value.value
                }
            } else {
                newValue = {
                    key: this.list.fieldName,
                    value: value
                }
            }
            this.$emit('change', newValue, 'ver')
        },
        updata(key) {
            if (this.$refs['control']) {
                this.check = this.list.controlData
                if (this.list.fieldGroup != '0') {
                    this.$refs['control'].updata(true, key)
                } else if (key && this.list.fieldName == key) {
                    this.$refs['control'].updata(true)
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'sysBoxValue'
        ])
    },
    watch: {
        sysBoxValue() {
            if (this.list.controlTypeId == 2) {
                this.getFieldData()
            }
        }
    },
    beforeDestroy() {
        this.options = null
        this.tagsBgColor = null
        this.getTags = null
        this.clearData = null
        this.changeItem = null
        this.getFieldData = null
        this.change = null
        this.updata = null
    },
    components: Object.assign({

    }, Controls, GroupControls)
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
            border: 1px solid #ecf0f5;
            color: RGBA(96, 98, 102, 1);
        }
        .label2{
            border: 1px solid RGBA(208, 2, 27, 1);
            color: RGBA(208, 2, 27, 1);
        }
        .control{
            margin-bottom:0;
            line-height:33px;
            display: inline-block;
        }
    }
}

</style>
