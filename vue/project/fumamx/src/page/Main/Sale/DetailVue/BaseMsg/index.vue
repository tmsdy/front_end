<template>
    <div class="BaseMsg">
        <div class="listBox">
            <template v-if="editSet.length!=0">
                <template v-for="(item,index) in editSet">
                    <div v-if="item.fieldCategory != 4" :key="index" class= "list">
                        <span class="cnFieldCaption">{{item.cnFieldCaption}}</span>
                        <component style="color:#222222;" v-bind:is="'control'+item.controlTypeId" ref="control" :itemData="item" :value="{value:items[item.fieldName]}" :items="items"></component>
                    </div>
                </template>
            </template>
        </div>
        <div class="listBox" style="padding-left:15px;">
            <!-- 标签展示 -->
            <tag-show :dataList="returnTags(items.tags)" @tagEditShow="flyBtnClick(moduleCode, 'otTag')" labelWidth="75px"></tag-show>

            <!-- 批注展示 -->
            <comments-show :dataList="items.comments" :moduleCode='moduleCode' :pageId="itemId"></comments-show>
        </div>
    </div>
</template>

<script>
import Controls from '@/components/ListShowControls/index.js'
import CommentsShow from '@/basecomponents/CommentsShow/index' // 批注展示
import TagShow from '@/basecomponents/TagShow/index' // 标签展示
export default {
    name: 'BaseMsg',
    props: {
        editSet: {
            type: Array,
            default: () => {
                return []
            }
        },
        items: {
            type: Object,
            default: () => {
                return {}
            }
        },
        itemId: {
            type: String,
            default: ''
        },
        moduleCode: {
            type: String,
            default: ''
        },
        tagsList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data() {
        return {
            addPeopleFrom: {
                // moduleCode:_this.moduleCode
            },
            optCode: 'otNew',
            argument: true
        }
    },
    created() {
    },
    computed: {
    },
    methods: {
        returnTags(list) {
            let newList = []
            if (list) {
                this.tagsList.forEach(item => {
                    list.forEach(element => {
                        if (item.labelId == element) {
                            newList.push(item)
                        }
                    })
                })
            }
            return newList
        },
        flyBtnClick(moduleNum, ot) {
            let Mcode = moduleNum && moduleNum !== '' ? moduleNum : this.moduleCode
            if (!ot) { return }
            let data = {
                moduleCode: Mcode,
                optCode: ot,
                identFieldValue: this.itemId
            }
            ep.emit('setGlobalLoading', {
                val: true, // 打开loading
                // 权限校验中...
                text: this.$t('mxpcweb.sale.components.1557564962363')
            })
            this.$http.get(this.Global.baseURL + this.Global.api.v2.document_rightCheck_do, { params: data }).then((res) => {
                ep.emit('setGlobalLoading', {
                    val: false // 关闭loading
                })
                if (res.body.code.toString() === this.Global.RES_OK) {
                    let obj = {
                        optData: {
                            optCode: ot,
                            optModuleCode: Mcode,
                            // 标签管理
                            optName: this.$t('mxpcweb.sale.components.1557564962553')
                        },
                        itemData: this.items,
                        billId: this.itemId,
                        moduleCode: this.moduleCode,
                        billName: this.items.quotaCode,
                        next: () => {
                            this.getData() // update
                        }
                    }
                    ep.emit('optClick', obj)
                } else {
                    this.$message.error(this.msg(res.body))
                }
            }, (res) => {
                this.$message.error(this.msg(res.body))
            })
        },
        getData() {
            this.$emit('getData')
        }
    },
    components: Object.assign({
        'comments-show': CommentsShow,
        'tag-show': TagShow
    }, Controls)
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
