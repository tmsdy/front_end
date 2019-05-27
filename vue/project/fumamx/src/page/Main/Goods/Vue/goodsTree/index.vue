<template>
    <li>
        <h3 @click="menuClick(treeData);" :class="[treeData.catgId == activeId ? 'active' : '', styleType == '1' ? 'h3Class1' : 'h3Class2']">
            <span class="open" :class="[styleType == '1' ? 'open1' : 'open2']" v-if="isFolder" @click.stop="toggle"><i class="iconfont" :class="[open ? 'icon-minus-thin': 'icon-plus-file']"></i></span>
            <em>{{treeData.display}}</em>
            <span class="setting" title="设置" @click.stop="toSeting(treeData.catgId)">
                <i class="iconfont icon-setting-main"></i>
            </span>
        </h3>
        <ul v-show="open" v-if="isFolder">
            <goods-tree v-for="(item,index) in treeData.categoryList" :key="index" :treeData="item" @click="menuClick" :activeId="activeId" styleType="2"></goods-tree>
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
    props: {
        activeId: {
            type: String,
            default: ''
        },
        treeData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        styleType: {
            type: String,
            default: '1'
        }
    },
    data() {
        return {
            open: false
        }
    },
    computed: {
        isFolder() {
            return this.treeData.categoryList && this.treeData.categoryList.length > 0
        }
    },
    methods: {
        toSeting(id) {
            this.$router.push('/main/systemset/goodsClass/' + id)
        },
        // 展开子菜单
        toggle: function (e) {
            if (this.isFolder) {
                this.open = !this.open
            }
        },
        menuClick(item) {
            this.$emit('click', item)
        }
    }

}
</script>
<style lang="less" scoped>
li {
    .h3Class1{
        padding: 8px 5px 8px 78px;
    }
    .h3Class2 {
        padding: 8px 5px 8px 94px;
    }
    h3 {
        border-left-width: 2px;
        border-left-style: solid;
        font-size: 14px;
        font-weight: normal;
        position: relative;
        margin-bottom: 1px;
        padding-right: 30px;
        border-left-color: white;
        >.open1{
            left: 54px;
        }
        >.open2{
            left: 70px;
        }
        >.open {
            width: 14px;
            height: 14px;
            line-height: 12px;
            text-align: center;
            position: absolute;
            border: 1px solid #909399;
            border-radius: 3px;
            top: 50%;
            margin-top: -7px;
            color: #909399;
            -webkit-transition: all 0.3s ease-out;
            -moz-transition: all 0.3s ease-out;
            -ms-transition: all 0.3s ease-out;
            -o-transition: all 0.3s ease-out;
            transition: all 0.3s ease-out;
            i {
            font-size: 12px;
            }
            &:hover {
            color: #d0021b;
            border-color: #d0021b;
            }
        }
        >em {
            font-style: normal;
        }
        >.setting{
            position: absolute;
            top: 50%;
            right: 10px;
            margin-top:-8px;
            display: none;
        }
        &:hover,
        &.active {
            background: #FCF2F3;
            border-left-color: #d0021b;
            color: #d0021b;
            cursor: pointer;
        }
        &:hover{
            .setting{
            display: inline;
            }
        }
    }
}
</style>
