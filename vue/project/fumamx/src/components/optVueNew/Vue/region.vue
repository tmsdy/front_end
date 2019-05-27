<template>
    <span class="region">
        <span v-if="this.group.fieldGroup==3">
            <span class="list">{{ownerName}}</span>
            <span class="list">{{deptName}}</span>
        </span>
        <span v-else-if="this.group.fieldGroup==1">
            <span class="list">{{countryName}}</span>
            <span class="list">{{provinceName}}</span>
            <span class="list">{{cityName}}</span>
            <span class="list">{{townName}}</span>
            <span class="list">{{items.remarks}}</span>
        </span>
    </span>
</template>

<script>
import { isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
export default {
    name: 'region',
    props: {
        group: {
            type: Object,
            default: function() {
                return {}
            }
        },
        items: {
            type: Object,
            default: function() {
                return {}
            }
        },
        types: {
            type: String,
            default: ''
        },
        moduleCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            region: '',
            owners: [],
            departments: [],
            ownerName: '',
            deptName: '',
            countryList: [],
            provinceList: [],
            cityList: [],
            townList: [],
            countryName: '',
            provinceName: '',
            cityName: '',
            townName: ''
        }
    },
    computed: {
        ...mapGetters([
            'individualConfigInfo',
            'contactList'
        ])
    },
    created() {
        this.init()
    },
    mounted() {

    },
    methods: {
        init() {
            if (this.group.fieldGroup == 3) {
                this.getOwerData()
            } else if (this.group.fieldGroup == 1) {
                this.getCountryData()
                this.countryChange()
                this.provinceChange()
                this.cityChange()
            }
        },
        returnName(id, fieldName) {
            if (this.group.fieldGroup == 1) {
                if (fieldName == 'countryId') {
                    let name = ''
                    this.countryList.forEach(function(item) {
                        if (item.countryId == id) {
                            name = item.cnName
                            return false
                        }
                    })
                    return name
                }
                if (fieldName == 'provinceId') {
                    let name = ''
                    this.provinceList.forEach(function(item) {
                        if (item.provinceId == id) {
                            name = item.cnName
                            return false
                        }
                    })
                    return name
                }
                if (fieldName == 'cityId') {
                    let name = ''
                    this.cityList.forEach(function(item) {
                        if (item.cityId == id) {
                            name = item.cnName
                            return false
                        }
                    })
                    return name
                }
                if (fieldName == 'townId') {
                    let name = ''
                    this.townList.forEach(function(item) {
                        if (item.townId == id) {
                            name = item.cnName
                            return false
                        }
                    })
                    return name
                }
            } else if (this.group.fieldGroup == 3) {
                if (fieldName == 'ownerCtId') {
                    let name = ''
                    this.owners.forEach(function(item) {
                        if (item.ctId == id) {
                            name = item.realName
                            return false
                        }
                    })
                    return name
                }
                if (fieldName == 'ownerDeptKey') {
                    let name = ''
                    this.departments.forEach(function(item) {
                        if (item.dkey == id) {
                            name = item.deptName
                            return false
                        }
                    })
                    return name
                }
            }
        },
        // 初始第一个下拉先 <-_->
        getOwerData() {
            let _this = this
            if (_this.items.ownerCtId && _this.items.ownerCtId == '') {
                _this.ownerName = ''
                return false
            }
            let departmentData = {
                    dataType: 'department',
                    funType: 'all',
                    deptCascade: true,
                    ctId: _this.items.ownerCtId
                }

            _this.owners = _this.contactList
            _this.ownerName = _this.contactList[_this.items.ownerCtId]
            if (_this.items.ownerDeptKey && _this.items.ownerDeptKey == '') {
                _this.deptName = ''
                return false
            };
            _this.$http.get(_this.Global.baseURL + _this.Global.api.v2.accountDropList_get, { params: departmentData }).then((res) => {
                if (res.body.code.toString() == _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.departments = res.body.data
                    _this.deptName = _this.returnName(_this.items.ownerDeptKey, 'ownerDeptKey')
                } else {
                    _this.$message.error(_this.msg(res.body))
                    _this.departments = []
                    _this.deptName = ''
                }
            }, (res) => {
                _this.$message.error(_this.$t(_this.Global.errorTitle))
            })
        },

        getCountryData() {
            let _this = this
            if (_this.items.countryId && _this.items.countryId == '') {
                _this.countryName = ''
                return false
            };
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.areaInf, { params: { id: 1, type: 'country' } }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK && isArray(res.body.data)) {
                    _this.countryList = res.body.data
                    _this.countryName = _this.returnName(_this.items.countryId, 'countryId')
                } else {
                    _this.countryList = []
                    _this.countryName = ''
                }
            })
        },
        countryChange() {
            let _this = this
            if (_this.items.provinceId && _this.items.provinceId == '') {
                return false
                _this.provinceName = ''
            };
            _this.$http.get(_this.Global.baseURL + _this.Global.api.SystemSet.enterpriseset.areaInf, { params: { id: _this.items.countryId, type: 'province' } }).then((res) => {
                if (res.body.code.toString() === _this.Global.RES_OK && isArray(res.body.data)) {
                    _this.provinceList = res.body.data
                    _this.provinceName = _this.returnName(_this.items.provinceId, 'provinceId')
                } else {
                    _this.provinceList = []
                    _this.provinceName = ''
                }
            })
        },
        provinceChange(value) {
            let _this = this
            if (_this.items.cityId && _this.items.cityId == '') {
                _this.cityName = ''
                return false
            };
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.areaInf, { params: { id: _this.items.provinceId, type: 'city' } }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK && isArray(res.body.data)) {
                    _this.cityList = res.body.data
                    _this.cityName = _this.returnName(_this.items.cityId, 'cityId')
                } else {
                     _this.cityList = []
                     _this.cityName = ''
                }
            })
        },
        cityChange(value) {
            let _this = this
            if (_this.items.townId && _this.items.townId == '') {
                _this.townName = ''
                return false
            };
            this.$http.get(this.Global.baseURL + this.Global.api.SystemSet.enterpriseset.areaInf, { params: { id: _this.items.cityId, type: 'town' } }).then((res) => {
                if (res.body.code.toString() === this.Global.RES_OK && isArray(res.body.data)) {
                    _this.townList = res.body.data
                    _this.townName = _this.returnName(_this.items.townId, 'townId')
                } else {
                    _this.townList = []
                    _this.townName = ''
                }
            })
        }
    },
    beforeDestroy: function () {
        this.getOwerData = null
        this.owners = null
    },
    watch: {
        'types': function(val, oldval) {
            this.init()
        }
    }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.region{
    .list{
        padding-right:5px;
    }
}
</style>
