<template>
    <li>
        <h3 @click="menuClick(treeData); lightThis($event)" :class="[treeData.catgId == itemData.catgId ? 'active' : '']">
            <span class="open" v-if="isFolder" @click.stop="toggle"><i class="iconfont" :class="[open ? 'icon-minus-thin': 'icon-plus-file']"></i></span>
            <em>{{treeData.display}}</em>
            <span class="delete" title="移除" @click.stop="deleteItem(treeData.catgId)">
                <i class="iconfont icon-remove-round"></i>
            </span>
        </h3>
        <ul v-show="open" v-if="isFolder">
            <goods-tree v-for="(item,index) in treeData.categoryList" :key="index" :treeData="item" :menuItem="menuItem" @click="menuClick" @getData="$emit('getData')"></goods-tree>
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
    props: ['treeData', 'menuItem'],
    data() {
        return {
            isLight: false,
            open: false,
            itemData: {},
            flag: true,
            copyObj: Object.assign({}, this.treeData)
        }
    },
    created() {
        this.checkItem() // 判断是否自定义高亮
    },
    computed: {
        isFolder() {
            return this.treeData.categoryList && this.treeData.categoryList.length > 0
        }
    },
    methods: {
        checkItem() {
            // 判断是否自定义高亮
            if (this.menuItem && this.menuItem.catgId) {
                this.open = true
                this.itemData.catgId = this.menuItem.catgId

                this.isLight = this.itemData.catgId == this.treeData.catgId
            }
        },
        // 展开子菜单
        toggle: function (e) {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        menuClick(item) {
            this.itemData = item
            this.$emit('click', item)
        },
        lightThis(event) {
            this.$router.push('/main/systemset/goodsClass/' + this.copyObj.catgId)
            let $this = $(event.target)
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
    },
    watch: {
        menuItem() {
            // console.log(' cc -- change ')
            this.checkItem() // 判断是否自定义高亮
        }
    }
}
</script>
