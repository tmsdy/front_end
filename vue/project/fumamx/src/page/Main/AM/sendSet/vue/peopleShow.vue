
<template>
    <span class="peopleShow">
        {{returnName()}}&nbsp;
    </span>
</template>

<script>
export default {
    name: 'peopleShow',
    props: {
        ctid: {
            type: Number,
            default: 0
        },
        owners: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
        }
    },
    methods: {
        returnName() {
            let name = ''
            if (this.ctid == 0) {
                // 全部人员
                return this.$t('mxpcweb.am.1531903437658')
            };
            this.owners.forEach(element => {
                if (element.ctId == this.ctid) {
                    name = element.realName
                }
            })
            return name
        }
    },
    components: {
    }
}
</script>
