<template>
    <li>
        <h3 @click="menuClick(treeData); lightThis($event)" :class="[treeData.catgId == '10154' ? 'active' : '']">
            <span class="open" v-if="isFolder" @click.stop="toggle"><i class="iconfont" :class="[open ? 'icon-minus-thin': 'icon-plus-file']"></i></span>
            <em>{{treeData.display}}</em>
            <span class="delete" title="移除" @click.stop="deleteItem(treeData.catgId)">
                <i class="iconfont icon-remove-round"></i>
            </span>
        </h3>
        <ul v-show="open" v-if="isFolder">
            <goods-tree v-for="(item,index) in treeData.categoryList" :key="index" :treeData="item" @click="menuClick"></goods-tree>
        </ul>
    </li>
</template>

<script>
/**
 * 描述：邮件部分
 * 作者：向士健
 * 时间：2018/11/11
 */
export default {
    name: 'goodsTree',
    props: ['treeData'],
    data() {
        return {
            open: false,
            data: {}
        }
    },
    computed: {
        isFolder() {
            return this.treeData.categoryList && this.treeData.categoryList.length > 0
        }
    },
    methods: {
        // 展开子菜单
        toggle: function (e) {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        menuClick(item) {
            this.data = item
            this.$emit('click', item)
        },
        lightThis(event) {
            let $this = $(event.target)
            $this.parents('#goodsTreeRoot').find('.active').removeClass('active')
            $this.addClass('active')
        },
        deleteItem(value) {
            let _this = this
            _this.$http.delete(this.Global.baseURL + this.Global.api.v2.document_product_companyCategory, {
                params: { targets: value }
            }).then(function (res) {
                if (res.body.code.toString() == _this.Global.RES_OK) {
                    _this.$message.success(_this.msg(res.body))
                    _this.$emit('getData')
                } else {
                    _this.$message.error(_this.msg(res.body))
                }
            }, function (res) {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        }
    }

}
</script>
