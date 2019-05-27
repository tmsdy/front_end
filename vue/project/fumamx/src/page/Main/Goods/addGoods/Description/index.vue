<template>
<span>
    <div class="Description text-hover" @click="dialog = true">
        {{text}}
    </div>
    <el-dialog title="描述字段" v-dialogDrag :visible.sync="dialog" :closeOnClickModal="false" custom-class="width620" :modal-append-to-body="false">
        <div class="dialog">
            <div class="DescriptionList">
                <span class="listTitle">材料</span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="DescriptionList">
                <span class="listTitle">规格</span>
                <el-select v-model="value2" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div slot="footer" style="text-align:center">
            <!-- 取消 -->
            <el-button @click="cancel">{{$t('mxpcweb.client.1529047588840')}}</el-button>
            <!-- 确定 -->
            <el-button type="primary" @click="submit">{{$t('mxpcweb.client.1529047741736')}}</el-button>
        </div>
    </el-dialog>
</span>
</template>

<script>
export default {
    name: 'Description',
    props: {
       DescriptionKey: {
           type: Object,
           default: () => {
               return {}
           }
       }
    },
    data() {
        return {
            text: '',
            key: {},
            dialog: false,
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            value: '',
            value2: ''
        }
    },
    created() {
    },
    mounted() {
        this.unit()
    },
    methods: {
        unit() {
            if (this.DescriptionKey.cailiao && this.DescriptionKey.cailiao != '') {
                this.options.find((value) => {
                    if (value.value === this.DescriptionKey.cailiao) {
                        this.value = value
                    }
                })
            }
            if (this.DescriptionKey.guige && this.DescriptionKey.guige != '') {
                this.options.find((value) => {
                    if (value.value === this.DescriptionKey.guige) {
                        this.value2 = value
                    }
                })
            }
            let text = []
            if (this.value && this.value.label) {
                text.push('材料:' + this.value.label)
            }
            if (this.value2 && this.value2.label) {
                text.push('规格:' + this.value2.label)
            }
            this.text = text.join(';')
        },
        submit() {
            let text = []
            let key = {}
            if (this.value && this.value.label) {
                text.push('材料:' + this.value.label)
                key.cailiao = this.value.value
            }
            if (this.value2 && this.value2.label) {
                text.push('规格:' + this.value2.label)
                key.guige = this.value2.value
            }
            this.text = text.join(';')
            this.$emit('update:DescriptionKey', key)
            this.dialog = false
        },
        cancel() {
            this.dialog = false
        }
    },
    components: {
    },
    watch: {
        DescriptionKey() {
            this.unit()
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Description{
    width: 500px;
    min-height: 50px;
    display: inline-block;
    resize: vertical;
    padding: 5px 7px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 14px;
    color: #606266;
    background-image: none;
    border: 1px solid #DFE2E4;
    border-radius: 3px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    :hover{
        border: 1px solid #D0021B;
    }
}
.dialog{
    min-height: 100px;
    .DescriptionList{
        display: inline-block;
        width: 49%;
        padding-left: 100px;
        position: relative;
        line-height: 40px;
        height: 40px;
        .listTitle{
            position: absolute;
            left: 10px;
        }
    }
}
</style>
