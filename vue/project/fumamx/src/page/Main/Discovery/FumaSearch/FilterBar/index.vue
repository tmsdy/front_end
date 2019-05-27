<template>
    <div class="FilterBar">
        <div class="filterBox">
            <div class="clearfix">
                <p class="name pull-left">关键词排除</p>
                <div class="box clearfix">
                    <div v-show="!adding" class="addBtn  pull-left iconfont icon-plus-file" @click="dialogFormVisible=true"></div>
                    <ul class="keyList pull-left clearfix">
                        <li v-for="(word ,index) in words" class="pull-left" :key="index">
                            {{word}}
                            <span class="closeBtn iconfont icon-close" @click="remove(index)"></span>
                        </li>
                    </ul>
                    <!-- <div v-show="adding" class="inputBox  pull-left">
                        <el-input class="input" type="text" v-model="word" @keyup.enter.native="addWord()"></el-input>
                        <el-button type="primary" size="small" @click="addWord()">确定</el-button>
                        <el-button size="small" @click="adding=false">取消</el-button>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="pull-right btmBox clearfix">
            <div class="pull-right clearfix">
                <div class="item pull-left" @click="$emit('showRecord')"><i class="iconfont icon-time"></i> 搜索记录</div>
                <div class="item pull-left" @click="$emit('hide')"><i class="iconfont icon-up-round"></i> 收起</div>
            </div>
        </div>
        <el-dialog v-dialogDrag title="关键词排除" :visible.sync="dialogFormVisible" size="tiny">
            包含该关键词的公司将会被直接过滤
            <br><br>
            <el-input v-model="word" @keyup.enter.native="addWord()" auto-complete="off"></el-input>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addWord()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'FilterBar',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dialogFormVisible: false,
            adding: false,
            words: this.value,
            word: ''
        }
    },
    methods: {
        addWord() {
            if (this.word && !this.words.includes(this.word)) {
                /*  if (this.words.length > 2) {
                     this.$message.error('最多添加三个标签！')
                     return
                 } */
                this.dialogFormVisible = false
                this.words.push(this.word)
                this.word = ''
                this.$emit('change', this.words)
            }
        },
        remove(index) {
            this.words.splice(index, 1)
            this.$emit('change', this.words)
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
