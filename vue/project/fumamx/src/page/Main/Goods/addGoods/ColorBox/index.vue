<template>
<div class="Controls-Color">
    <!-- 颜色 -->
    <span class="title" :style="{'width': '100px'}">颜色</span>
    <div v-for="(item, index) in list" :key="index" class="list">
        <el-checkbox v-model="item.checked" @change="checkChange(item, index)"></el-checkbox>
        <el-popover placement="top" width="600" trigger="click">
            <color-box :value.sync="item.color"></color-box>
            <div slot="reference" style="width:255px;height: 32px;
                line-height: 32px;
                border: 1px solid rgb(223, 226, 228);
                border-radius: 3px;
                padding-left:10px;
                vertical-align: bottom;
                display: inline-block;">
                <!-- 选择主色 -->
                <span v-if="item.color.colorName==''" style="color:rgb(188, 188, 188)">选择主色</span>
                <span v-else>{{item.color.colorName}}</span>
            </div>
        </el-popover>
        <!-- 备注（如偏深偏浅等） -->
        <el-input style="width:160px;" placeholder="备注（如偏深偏浅等）" v-model="item.content"></el-input>
        <!-- <el-button>上传图片</el-button> -->
        <up-load :value.sync="item.img"></up-load>
    </div>
</div>
</template>

<script>
// 暂时不用
import colorBox from './colorBox'
import upLoad from './upLoad'
export default {
    name: 'Controls-Color',
    props: {
    },
    data() {
        return {
            list: [{
                checked: false,
                color: {
                    colorId: '',
                    color: '',
                    colorName: '',
                    groupId: ''
                },
                content: '',
                img: ''
            }]
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        checkChange(item, index) {
            if (item.checked && index == (this.list.length - 1)) {
                this.list.push({
                    checked: false,
                    color: {
                        colorId: '',
                        color: '',
                        colorName: '',
                        groupId: ''
                    },
                    content: '',
                    img: ''
                })
            } else if (!item.checked) {
                this.list.splice(index, 1)
            }
        }
    },
    components: {
        'color-box': colorBox,
        'up-load': upLoad
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Controls-Color{
    min-height: 36px;
    margin-bottom: 5px;
    padding-left: 100px;
    position: relative;
    .title{
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
    }
    .list{
        height: 44px;
    }
}
</style>
