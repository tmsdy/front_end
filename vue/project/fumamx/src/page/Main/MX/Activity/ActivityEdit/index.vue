<template>
    <div class="ImgEdit">
        <el-button @click="$emit('toShowList')">返回</el-button>
        <ul class="editBody MXscroll">
            <li>
                <div class="label">活动名称</div>
                <el-input v-model="form.activityName" placeholder="请输入活动名称" style="width:333px;"></el-input>
            </li>
            <li>
                <div class="label">活动时间</div>
                <el-date-picker v-model="form.date" type="datetimerange" placeholder="选择时间范围" style="width:333px;"> </el-date-picker>
            </li>
            <li>
                <div class="label">活动内容</div>
                <div class="activityContent">
                    <dl v-if="form.activityInfo.PK0001">
                        <dt>CRM</dt>
                        <dd v-for="(item,index) in form.activityInfo.PK0001" :key="index">
                            <span class="marginR">{{item.yearCount}}年</span>
                            <el-select v-model="item.type" placeholder="请选择" style="width:65px;margin-right:8px;">
                                <el-option v-for="(item,index) in options" :key="index" :label="item == 'money' ? '减' : '赠'" :value="item"> </el-option>
                            </el-select>
                            <el-input v-model="item.nums" placeholder="请输入" style="width:65px;margin-right:3px;"></el-input>
                            <span class="marginR">{{item.type == 'money' ? '元' : '月'}}</span>
                            <span class="marginR" style="margin-left:10px;">描述</span>
                            <el-input v-model="item.description" placeholder="请输入" style="width:275px;"></el-input>
                        </dd>
                    </dl>
                    <dl v-if="form.activityInfo.PK0002">
                        <dt>发现</dt>
                        <dd v-for="(item,index) in form.activityInfo.PK0002" :key="index">
                            <span class="marginR">{{item.yearCount}}年</span>
                            <el-select v-model="item.type" placeholder="请选择" style="width:65px;margin-right:8px;">
                                <el-option v-for="(item,index) in options" :key="index" :label="item == 'money' ? '减' : '赠'" :value="item"> </el-option>
                            </el-select>
                            <el-input v-model="item.nums" placeholder="请输入" style="width:65px;margin-right:3px;"></el-input>
                            <span class="marginR">{{item.type == 'money' ? '元' : '月'}}</span>
                            <span class="marginR" style="margin-left:10px;">描述</span>
                            <el-input v-model="item.description" placeholder="请输入" style="width:275px;"></el-input>
                        </dd>
                    </dl>
                    <dl v-if="form.activityInfo.PK0003">
                        <dt>营销云</dt>
                        <dd v-for="(item,index) in form.activityInfo.PK0003" :key="index">
                            <span class="marginR">{{item.yearCount}}年</span>
                            <el-select v-model="item.type" placeholder="请选择" style="width:65px;margin-right:8px;">
                                <el-option v-for="(item,index) in options" :key="index" :label="item == 'money' ? '减' : '赠'" :value="item"> </el-option>
                            </el-select>
                            <el-input v-model="item.nums" placeholder="请输入" style="width:65px;margin-right:3px;"></el-input>
                            <span class="marginR">{{item.type == 'money' ? '元' : '月'}}</span>
                            <span class="marginR" style="margin-left:10px;">描述</span>
                            <el-input v-model="item.description" placeholder="请输入" style="width:275px;"></el-input>
                        </dd>
                    </dl>
                    <dl v-if="form.activityInfo.PK0006">
                        <dt>销售云-Pro</dt>
                        <dd v-for="(item,index) in form.activityInfo.PK0006" :key="index">
                            <span class="marginR">{{item.yearCount}}年</span>
                            <el-select v-model="item.type" placeholder="请选择" style="width:65px;margin-right:8px;">
                                <el-option v-for="(item,index) in options" :key="index" :label="item == 'money' ? '减' : '赠'" :value="item"> </el-option>
                            </el-select>
                            <el-input v-model="item.nums" placeholder="请输入" style="width:65px;margin-right:3px;"></el-input>
                            <span class="marginR">{{item.type == 'money' ? '元' : '月'}}</span>
                            <span class="marginR" style="margin-left:10px;">描述</span>
                            <el-input v-model="item.description" placeholder="请输入" style="width:275px;"></el-input>
                        </dd>
                    </dl>
                    <dl v-if="form.activityInfo.PK0005">
                        <dt>销售云</dt>
                        <dd v-for="(item,index) in form.activityInfo.PK0005" :key="index">
                            <span class="marginR">{{item.yearCount}}年</span>
                            <el-select v-model="item.type" placeholder="请选择" style="width:65px;margin-right:8px;">
                                <el-option v-for="(item,index) in options" :key="index" :label="item == 'money' ? '减' : '赠'" :value="item"> </el-option>
                            </el-select>
                            <el-input v-model="item.nums" placeholder="请输入" style="width:65px;margin-right:3px;"></el-input>
                            <span class="marginR">{{item.type == 'money' ? '元' : '月'}}</span>
                            <span class="marginR" style="margin-left:10px;">描述</span>
                            <el-input v-model="item.description" placeholder="请输入" style="width:275px;"></el-input>
                        </dd>
                    </dl>
                </div>
            </li>
            <li>
                <div class="label">活动区域</div>
                <el-select v-model="form.area" placeholder="请选择" style="width:333px;" multiple>
                    <el-option v-for="(item,index) in areaList" :key="index" :label="item.areaName" :value="item.areaId+''"> </el-option>
                </el-select>
            </li>
            <li>
                <div class="label">展示位置</div>
                <el-radio-group v-model="form.showPosition">
                    <el-radio :label="1">注册登录</el-radio>
                    <el-radio :label="2">头像侧滑菜单</el-radio>
                    <el-radio :label="3">帮助中心</el-radio>
                </el-radio-group>
            </li>
            <li>
                <!-- <div class="label">图片 <small>(图片尺寸为150px*200px)</small></div> -->
                <div class="label">图片 <small></small></div>
                <div class="pickImg" v-if="form.pictureId !== ''">
                    <a :href="getGlobalImgSrc(form.pictureId)" data-lightbox="FumaMX" data-title="FumaMX"><img :src="getGlobalImgSrc(form.pictureId, '300x300')"></a>
                </div>
                <div class="pickImg">
                    <file-upload :showList="false" :limitSize="2" @change="pickPicChange" :multiple="false" accept="image/jpeg,image/jpg,image/png,image/gif">
                        <div slot="trigger" class="pickBtn">
                            <i class="iconfont icon-plus-file"></i>
                        </div>
                    </file-upload>
                </div>
            </li>
            <div style="margin-top:15px;clear:both;">
                <!-- 编辑时 -->
                <el-button type="primary" size="large" @click="formEdit()" :loading="submiting" v-if="isEditingId">保存</el-button>
                <!-- 新增时 -->
                <el-button type="primary" size="large" @click="formPost()" :loading="submiting" v-else>确定</el-button>

                <el-button type="" size="large" @click="$emit('toShowList')">取消</el-button>
            </div>
        </ul>

    </div>
</template>
<script>
import FileUpload from '@/components/FileUpload/index' // 文件上传
export default {
    name: 'ImgEdit',
    props: {
        areaList: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data() {
        return {
            tableData3: [],
            submiting: false, // 提交中
            options: ['day', 'money'],
            form: {
                activityName: '',
                date: [],
                showPosition: '',
                area: [],
                pictureId: '',
                activityInfo: {
                    PK0001: [
                        { yearCount: 1, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 2, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 3, type: 'money', nums: 0, description: '', moneyCut: 0 }
                    ],
                    PK0002: [
                        { yearCount: 1, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 2, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 3, type: 'money', nums: 0, description: '', moneyCut: 0 }
                    ],
                    PK0003: [
                        { yearCount: 1, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 2, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 3, type: 'money', nums: 0, description: '', moneyCut: 0 }
                    ],
                    // 销售云-Pro
                    PK0006: [
                        { yearCount: 1, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 2, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 3, type: 'money', nums: 0, description: '', moneyCut: 0 }
                    ],
                    // 销售云
                    PK0005: [
                        { yearCount: 1, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 2, type: 'money', nums: 0, description: '', moneyCut: 0 },
                        { yearCount: 3, type: 'money', nums: 0, description: '', moneyCut: 0 }
                    ]
                }
            },
            isEditingId: null // 当前编辑ID
        }
    },
    created() {
    },
    mounted() { },
    methods: {
        // 图片选择
        pickPicChange(val) {
            // console.log(val)
            if (val.length > 0) {
                this.form.pictureId = val[val.length - 1].url
            }
        },
        // 父来调 编辑
        editItem(item) {
            this.isEditingId = item.activityId

            let PK0001 = []
            let PK0002 = []
            let PK0003 = []
            let PK0005 = []
            let PK0006 = []
            item.activityInfos.forEach(item => {
                if (item.pkCode == 'PK0001') {
                    PK0001.push(item)
                }
                if (item.pkCode == 'PK0002') {
                    PK0002.push(item)
                }
                if (item.pkCode == 'PK0003') {
                    PK0003.push(item)
                }
                if (item.pkCode == 'PK0005') {
                    PK0005.push(item)
                }
                if (item.pkCode == 'PK0006') {
                    PK0006.push(item)
                }
            })
            let activitys = {
                PK0001: PK0001,
                PK0002: PK0002,
                PK0003: PK0003,
                PK0005: PK0005,
                PK0006: PK0006
            }
            this.form = {
                activityName: item.activityName,
                date: [new Date(item.beginDate.replace(/-/g, '/')), new Date(item.endDate.replace(/-/g, '/'))],
                showPosition: item.showPosition,
                area: item.area.split(','),
                pictureId: item.pictureCode,
                activityInfo: activitys
            }
        },
        // 表单验证
        checkForm() {
            if (this.form.activityName == '') {
                this.$message('请输入活动名称')
                return false
            }
            if (this.form.date.length < 2) {
                this.$message('请选择活动时间')
                return false
            }
            if (this.form.date.showPosition == '') {
                this.$message('请选择展示位置')
                return false
            }
            if (this.form.pictureId == '') {
                this.$message('请上传图片')
                return false
            }
            if (this.form.area.length == 0) {
                this.$message.error('请选择活动区域')
                return false
            }
            return true
        },
        // 确定修改
        formEdit() {
            if (!this.checkForm()) { return }
            if (this.form.showPosition == '') {
                this.$message.error('请选择展示位置')
                return false
            }
            let data = {
                activityId: this.isEditingId,
                activityName: this.form.activityName,
                pictureCode: this.form.pictureId,
                showPosition: this.form.showPosition,
                beginDate: this.$m_unifiedTime(this.form.date[0]),
                endDate: this.$m_unifiedTime(this.form.date[1]),
                area: this.form.area.join(','),
                activityInfo: this.form.activityInfo
            }
            this.submiting = true
            this.$http
                .put(this.Global.baseURL + this.Global.api.v2.activity, data).then(res => {
                    this.submiting = false
                    if (res.body.code.toString() == this.Global.RES_OK) {
                        this.$message.success(res.body.msg)
                        this.$emit('toShowList') // 返回
                    } else {
                        this.$message.error(res.body.msg)
                    }
                },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        },
        // 新增
        formPost() {
            if (!this.checkForm()) { return }
            let data = {
                activityName: this.form.activityName,
                pictureCode: this.form.pictureId,
                showPosition: this.form.showPosition,
                beginDate: this.$m_unifiedTime(this.form.date[0]),
                endDate: this.$m_unifiedTime(this.form.date[1]),
                area: this.form.area,
                activityInfo: this.form.activityInfo
            }
            // return
            this.submiting = true
            this.$http
                .post(this.Global.baseURL + this.Global.api.v2.activity, data)
                .then(
                    res => {
                        this.submiting = false
                        if (res.body.code.toString() == this.Global.RES_OK) {
                            this.$message.success(res.body.msg)
                            this.$emit('toShowList') // 返回
                        } else {
                            this.$message.error(res.body.msg)
                        }
                    },
                    res => {
                        this.$message.error(this.$t(this.Global.errorTitle))
                    }
                )
        }
    },
    components: {
        'file-upload': FileUpload
    }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./zh-cn.less";
@import "./en.less";
</style>
