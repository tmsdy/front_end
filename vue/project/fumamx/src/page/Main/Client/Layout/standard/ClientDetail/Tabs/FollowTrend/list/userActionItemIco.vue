<template>
    <span class="moduleIco">
    <!-- <span class="moduleIco" :style="moduleBgColor"> -->
        <i class="iconfont" :class="moduleIco" style="font-size: 13px;"></i>
    </span>
</template>

<script>
/**
 * 描述：系统设置=>日志与行为
 * 作者：向士健
 * 时间：2017/10/31
 */
export default {
    name: 'userActionIco',
    props: {
        trackMode: {
            type: String,
            required: true,
            default: ''
        }
    },
    data() {
        return {
            moduleBgColor: '', // 默认模块背景色
            moduleIco: '' // 默认模块图标
        }
    },
    created() {
        this.getIcon()
    },
    methods: {
        getIcon() {
            let _this = this
            // console.log(_this.trackMode);
            switch (_this.trackMode) {
                case '1':
                    _this.moduleBgColor = 'background-color:#d0021b'
                    _this.moduleIco = 'icon-telephone'
                    break
                case '2':
                    _this.moduleBgColor = 'background-color:#d0021b'
                    _this.moduleIco = 'icon-mail'
                    break
                case '3':
                    _this.moduleBgColor = 'background-color:#d0021b'
                    _this.moduleIco = 'icon-one-to-one'
                    break
                case '4':
                    _this.moduleBgColor = 'background-color:#d0021b'
                    _this.moduleIco = 'icon-groups'
                    break
                case '5':
                    _this.moduleBgColor = 'background-color:#d0021b'
                    _this.moduleIco = 'icon-mail-a'
                    break
                case '6':
                    _this.moduleBgColor = 'background-color:#d0021b'
                    _this.moduleIco = 'icon-print'
                    break
                case '':
                    _this.moduleBgColor = 'background-color:#d0021b'
                    _this.moduleIco = 'icon-go'
                    break
            }
        }
    },
    watch: {
        trackMode: function() {
            this.getIcon()
        }
    }
}
</script>
