<template>
    <div class="targetBoxheader">
        <el-menu :default-active="activeIndex" class="target-menu" mode="horizontal" @select="handleSelect" menu-trigger="click">
            <el-submenu index="1">
                <template slot="title">
                    <i class="iconfont icon-edit-font" title="字体"></i>
                </template>
                <el-menu-item :index="item" v-for="item in fontFamily" :key="item.index">{{item}}</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title"><i class="iconfont icon-edit-size" title="字体大小"></i></template>
                <el-menu-item :index="item.value" :style="'font-size:' + item.value" v-for="item in fontsize" :key="item.index">{{item.text}}</el-menu-item>
            </el-submenu>
            <el-menu-item index="3">
                <div style="position: relative;">
                    <i class="iconfont icon-edit-color" title="字体颜色">
                        <el-color-picker v-model="color" @change="colorChange"></el-color-picker>
                    </i>
                </div>
            </el-menu-item>
            <el-menu-item index="4">
                <div style="position: relative;">
                    <i class="iconfont icon-edit-background" title="背景颜色">
                        <el-color-picker v-model="bgColor" @change="bgChange"></el-color-picker>
                    </i>
                </div>
            </el-menu-item>
            <el-submenu index="5">
                <template slot="title">
                    <i class="iconfont icon-edit-align" title="对齐方式"></i>
                </template>
                <el-menu-item :index="item.value" v-for="item in textArr" :key="item.index">{{item.text}}</el-menu-item>
            </el-submenu>
        </el-menu>
        <div class="preview" @click="showPreview">
            <i class="iconfont icon-eye"></i>
            预览
        </div>
    </div>
</template>

<script>
export default {
    name: 'TargetHeader',
    data() {
        return {
            fontFamily: ['Serif', 'Arial', 'Georgia', 'Verdana'],
            iconShow: false,
            iconBg: false,
            activeIndex: '2',
            color: '#20a0ff',
            bgColor: '#ffffff',
            textArr: [
                {
                    'value': 'left',
                    'text': '左对齐'
                },
                {
                    'value': 'right',
                    'text': '右对齐'
                }
            ],
            fontsize: [
                {
                    'value': '12px',
                    'text': 'Font12'
                },
                {
                    'value': '13px',
                    'text': 'Font13'
                },
                {
                    'value': '14px',
                    'text': 'Font14'
                },
                {
                    'value': '15px',
                    'text': 'Font15'
                },
                {
                    'value': '16px',
                    'text': 'Font16'
                }
            ],
            diyStyle: {
                fontFamily: '',
                fontsize: '',
                color: '',
                background: '',
                textalign: ''
            }
        }
    },
    props: {
        // titleData: {
        //     type: String,
        //     default: '无标题表单'
        // }
    },
    created() { },
    mounted() { },
    methods: {
        colorChange() {
            this.diyStyle.color = this.color
            this.$emit('diyStyle', this.diyStyle)
        },
        bgChange() {
            this.diyStyle.background = this.bgColor
            this.$emit('diyStyle', this.diyStyle)
        },
        changefont(x) {
            // console.log(x)
        },
        checkIcon() {
            this.iconShow = true
            this.iconBg = true
        },
        handleSelect(key, keyPath) {
            switch (parseInt(keyPath[0])) {
                case 1:
                    this.diyStyle.fontFamily = key
                    break
                case 2:
                    this.diyStyle.fontsize = key
                    break
                case 3:
                    break
                case 4:
                    break
                case 5:
                    this.diyStyle.textalign = key
                    break
            }
            this.$emit('diyStyle', this.diyStyle)
        },
        showPreview() {
            this.$emit('showPreview', true)
        }
    }
}
</script>
<style lang="less" >
.targetBoxheader {
    .el-menu {
        background-color: transparent;
    }
    .el-submenu__title {
        height: 40px !important;
        line-height: 40px !important;
        padding: 0 10px !important;
    }
    .el-menu--horizontal .el-submenu .el-submenu__title {
        height: 40px !important;
        line-height: 40px !important;
        border-bottom: none !important;
    }
    .el-menu--horizontal .el-submenu > .el-menu {
        top: 40px;
    }
    .el-menu--horizontal .el-submenu .el-submenu__icon-arrow {
        display: none;
    }
    .el-menu--horizontal > .el-submenu.is-active {
        // background-color: #fff;
    }
    .is-opened {
        background-color: #fff !important;
    }
    .el-menu--horizontal .el-menu-item {
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
    }
    .el-color-picker__trigger {
        border: none;
    }
    .el-menu--horizontal > .el-menu-item:hover {
        border-bottom: 5px solid transparent;
    }
    .el-color-picker {
        opacity: 0;
        top: 0;
        left: -13px;
        position: absolute;
    }
}
</style>

<style lang="less" rel="stylesheet/less" scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
