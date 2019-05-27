<template>
    <div class="colorBox">
        <div class="group-list">
            <ul class="names">
                <li class="name" v-for="(item, index) in list" :key="index" :class="groupId == item.groupId?'active':''" @mouseover="selectStyle(item)">
                    <span class="rgb-box" :style="{'background': item.bgColor}"></span>{{item.groupName}}
                </li>
            </ul>
        </div>
        <div class="color-list">
            <p>常用标准颜色：</p>
            <ul>
                <li class="color" data-value="28321" v-for="(item, index) in colorList" :key="index" :class="colorId == item.colorId?'active':''" @click="colorCheck(item)">
                    <span class="rgb-box" :style="{'background': item.color}"></span>{{item.colorName}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Controls-Color',
    props: {
    },
    data() {
        return {
            list: [
                {
                    colorGroup: [
                        {
                            colorId: '10001',
                            color: '#fffbf0',
                            colorName: '乳白色',
                            groupId: '1'
                        }, {
                            colorId: '10002',
                            color: '#fff',
                            colorName: '白色',
                            groupId: '1'
                        }, {
                            colorId: '10003',
                            color: '#eedeb0',
                            colorName: '米白色',
                            groupId: '1'
                        }
                    ],
                    groupName: '白色系',
                    bgColor: '#ffffff',
                    groupId: '1'
                }, {
                    colorGroup: [{
                            colorId: '20001',
                            color: '#e4e4e4',
                            colorName: '浅灰色',
                            groupId: '2'
                        }, {
                            colorId: '20002',
                            color: '#666666',
                            colorName: '深灰色',
                            groupId: '2'
                        }, {
                            colorId: '20003',
                            color: '#808080',
                            colorName: '灰色',
                            groupId: '2'
                        }, {
                            colorId: '20004',
                            color: '#c0c0c0',
                            colorName: '银色',
                            groupId: '2'
                        }
                    ],
                    groupName: '灰色系',
                    bgColor: '#808080',
                    groupId: '2'
                }, {
                    colorGroup: [{
                        colorId: '30001',
                        color: '#000000',
                        colorName: '黑色',
                        groupId: '3'
                    }],
                    groupName: '黑色系',
                    bgColor: '#000000',
                    groupId: '3'
                }, {
                    colorGroup: [{
                        colorId: '40001',
                        color: '#ff7500',
                        colorName: '桔红色',
                        groupId: '4'
                    }, {
                        colorId: '40002',
                        color: '#df1b76',
                        colorName: '玫红色',
                        groupId: '4'
                    }, {
                        colorId: '40003',
                        color: '#ffb6c1',
                        colorName: '粉红色',
                        groupId: '4'
                    }, {
                        colorId: '40004',
                        color: '#ff0000',
                        colorName: '红色',
                        groupId: '4'
                    }, {
                        colorId: '40005',
                        color: '#eed0d8',
                        colorName: '藕色',
                        groupId: '4'
                    }, {
                        colorId: '40006',
                        color: '#f05654',
                        colorName: '西瓜红',
                        groupId: '4'
                    }, {
                        colorId: '40007',
                        color: '#990000',
                        colorName: '酒红色',
                        groupId: '4'
                    }],
                    groupName: '红色系',
                    bgColor: '#ff0000',
                    groupId: '4'
                }, {
                    colorGroup: [{
                        colorId: '50001',
                        color: '#c3b091',
                        colorName: '卡其色',
                        groupId: '5'
                    }, {
                        colorId: '50002',
                        color: '#ffc773',
                        colorName: '姜黄色',
                        groupId: '5'
                    }, {
                        colorId: '50003',
                        color: '#ffff01',
                        colorName: '明黄色',
                        groupId: '5'
                    }, {
                        colorId: '50004',
                        color: '#f7eed6',
                        colorName: '杏色',
                        groupId: '5'
                    }, {
                        colorId: '50005',
                        color: '#ffec43',
                        colorName: '柠檬黄',
                        groupId: '5'
                    }, {
                        colorId: '50006',
                        color: '#ffa500',
                        colorName: '桔色',
                        groupId: '5'
                    }, {
                        colorId: '50007',
                        color: '#faff72',
                        colorName: '浅黄色',
                        groupId: '5'
                    }, {
                        colorId: '50008',
                        color: '#eaff56',
                        colorName: '荧光黄',
                        groupId: '5'
                    }, {
                        colorId: '50009',
                        color: '#ffd700',
                        colorName: '金色',
                        groupId: '5'
                    }, {
                        colorId: '500010',
                        color: '',
                        colorName: '香槟色',
                        groupId: '5'
                    }, {
                        colorId: '500011',
                        color: '#ffff00',
                        colorName: '黄色',
                        groupId: '5'
                    }],
                    groupName: '黄色系',
                    bgColor: '#ffff00',
                    groupId: '5'
                }, {
                    colorGroup: [{
                        colorId: '60001',
                        color: '#5d762a',
                        colorName: '军绿色',
                        groupId: '6'
                    }, {
                        colorId: '60002',
                        color: '#057748',
                        colorName: '墨绿色',
                        groupId: '6'
                    }, {
                        colorId: '60003',
                        color: '#98fb98',
                        colorName: '浅绿色',
                        groupId: '6'
                    }, {
                        colorId: '60004',
                        color: '#008000',
                        colorName: '绿色',
                        groupId: '6'
                    }, {
                        colorId: '60005',
                        color: '#0aa344',
                        colorName: '翠绿色',
                        groupId: '6'
                    }, {
                        colorId: '60006',
                        color: '#23fa07',
                        colorName: '荧光绿',
                        groupId: '6'
                    }, {
                        colorId: '60007',
                        color: '#00e09e',
                        colorName: '青色',
                        groupId: '6'
                    }],
                    groupName: '绿色系',
                    bgColor: '#008000',
                    groupId: '6'
                }, {
                    colorGroup: [{
                        colorId: '70001',
                        color: '#44cef6',
                        colorName: '天蓝色',
                        groupId: '7'
                    }, {
                        colorId: '70002',
                        color: '#00a4c5',
                        colorName: '孔雀蓝',
                        groupId: '7'
                    }, {
                        colorId: '70003',
                        color: '#4b5cc4',
                        colorName: '宝蓝色',
                        groupId: '7'
                    }, {
                        colorId: '70004',
                        color: '#d2f0f4',
                        colorName: '浅蓝色',
                        groupId: '7'
                    }, {
                        colorId: '70005',
                        color: '#041690',
                        colorName: '深蓝色',
                        groupId: '7'
                    }, {
                        colorId: '70006',
                        color: '#30dff3',
                        colorName: '湖蓝色',
                        groupId: '7'
                    }, {
                        colorId: '70007',
                        color: '#0000fe',
                        colorName: '蓝色',
                        groupId: '7'
                    }, {
                        colorId: '70008',
                        color: '#2e4e7e',
                        colorName: '藏青色',
                        groupId: '7'
                    }],
                    groupName: '蓝色系',
                    bgColor: '#0000fe',
                    groupId: '7'
                }, {
                    colorGroup: [{
                        colorId: '80001',
                        color: '#ede0e6',
                        colorName: '浅紫色',
                        groupId: '8'
                    }, {
                        colorId: '80002',
                        color: '#430653',
                        colorName: '深紫色',
                        groupId: '8'
                    }, {
                        colorId: '80003',
                        color: '#8b0062',
                        colorName: '紫红色',
                        groupId: '8'
                    }, {
                        colorId: '80004',
                        color: '#b7ace4',
                        colorName: '紫罗兰',
                        groupId: '8'
                    }, {
                        colorId: '80005',
                        color: '#800080',
                        colorName: '紫色',
                        groupId: '8'
                    }],
                    groupName: '紫色系',
                    bgColor: '#800080',
                    groupId: '8'
                }, {
                    colorGroup: [{
                        colorId: '90001',
                        color: '#603912',
                        colorName: '咖啡色',
                        groupId: '9'
                    }, {
                        colorId: '90002',
                        color: '#d2691e',
                        colorName: '巧克力色',
                        groupId: '9'
                    }, {
                        colorId: '90003',
                        color: '#60281e',
                        colorName: '栗色',
                        groupId: '9'
                    }, {
                        colorId: '90004',
                        color: '#b35c44',
                        colorName: '浅棕色',
                        groupId: '9'
                    }, {
                        colorId: '90005',
                        color: '#bdb76b',
                        colorName: '深卡其布色',
                        groupId: '9'
                    }, {
                        colorId: '90006',
                        color: '#7c4b00',
                        colorName: '深棕色',
                        groupId: '9'
                    }, {
                        colorId: '90007',
                        color: '#855b00',
                        colorName: '褐色',
                        groupId: '9'
                    }, {
                        colorId: '90008',
                        color: '#a88462',
                        colorName: '驼色',
                        groupId: '9'
                    }],
                    groupName: '棕色系',
                    bgColor: '#7c4b00',
                    groupId: '9'
                }, {
                    colorGroup: [{
                        colorId: '100001',
                        color: 'url(//img.alicdn.com/tps/i4/TB1FAHPFVXXXXb2XFXX8DnLHFXX-60-20.png)',
                        colorName: '花色',
                        groupId: '10'
                    }],
                    groupName: '花色系',
                    bgColor: 'url(//img.alicdn.com/tps/i4/TB1FAHPFVXXXXb2XFXX8DnLHFXX-60-20.png)',
                    groupId: '10'
                }, {
                    colorGroup: [{
                        colorId: '110001',
                        color: 'url(//img.alicdn.com/tps/i3/TB1h8_PFVXXXXcAXFXX8DnLHFXX-60-20.png)',
                        colorName: '透明',
                        groupId: '11'
                    }],
                    groupName: '透明系',
                    bgColor: 'url(//img.alicdn.com/tps/i3/TB1h8_PFVXXXXcAXFXX8DnLHFXX-60-20.png)',
                    groupId: '11'
                }
            ],
            colorList: [],
            groupId: '',
            colorId: ''
        }
    },
    created() {
        this.selectStyle(this.list[0])
    },
    mounted() {
    },
    methods: {
        selectStyle(item) {
            this.groupId = item.groupId
            this.colorList = item.colorGroup
        },
        colorCheck(item) {
            this.colorId = item.colorId
            this.$emit('update:value', item)
        }
    },
    components: {
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.colorBox{
    width: 600px;
    height: 426px;
    position: relative;
    padding-left: 150px;
    font-size: 12px;
    .active{
        background: #d7d7d7;
    }
    .group-list{
        width: 150px;
        height: 100%;
        border: 1px solid #bcbcbc;
        position: absolute;
        left: 0;
        top: 0;
        .names{
            .name{
                height: 36px;
                line-height: 36px;
                .rgb-box{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    margin: 0 10px;
                    border: 1px solid #dddddd;
                }
                &:hover{
                    background: #d7d7d7;
                    cursor: pointer;
                }
            }
        }
    }
    .color-list{
        display: inline-block;
        width: 450px;
        height: 100%;
        overflow: hidden;
        padding: 15px 20px;
        >p{
            height: 30px;
            line-height: 30px;
        }
        .color{
            height: 30px;
            line-height: 30px;
            width: 114px;
            float: left;
            margin: 0 10px 5px 0;
            .rgb-box{
                display: inline-block;
                width: 12px;
                height: 12px;
                margin: 0 10px;
                border: 1px solid #dddddd;
            }
            &:hover{
                background: #d7d7d7;
                cursor: pointer;
            }
        }
    }
}
</style>
