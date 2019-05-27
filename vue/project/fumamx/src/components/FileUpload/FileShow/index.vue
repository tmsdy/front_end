<template>
    <span class="icon">
        <!--<i class="iconfile" :class="getSuffix(item.name)"></i>-->
        <img ref="image" v-if="isPicture(item.name.toLowerCase())" :src="getimg(getGlobalImgSrc(item.url, '34x34'))">
        <svg v-else class="iconSVG" aria-hidden="true">
            <use :xlink:href="getSuffixSVG(item.name)"></use>
        </svg>
    </span>
</template>

<script>
/**
 * 描述：文件上传UI封装
 * 作者：向士健
 * 时间：2019/1/29
 */
import { getSuffix, isHasSuffix } from '@/libs/utils.js'
export default {
    name: 'FileShow',
    props: {
        item: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
    },
    mounted() {
    },
    methods: {
        getimg(url, times = 3) {
            times--
            let img = new Image()
            img.src = url
            img.onload = () => {
                this.$refs.image.src = url
            }
            img.onerror = () => {
                if (times <= 0) { return }
                setTimeout(() => {
                    this.getimg(url, times)
                }, 2 * 1000)
            }
        },
        isPicture(name) {
            let picFormat = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
            return picFormat.indexOf(getSuffix(name)) !== -1
        },
        getSuffix(filename) {
            let suffix = getSuffix(filename)
            return 'file-' + isHasSuffix(suffix)
        },
        getSuffixSVG(filename) {
            let suffix = getSuffix(filename)
            return '#file-' + isHasSuffix(suffix)
        }
    }
}
</script>
