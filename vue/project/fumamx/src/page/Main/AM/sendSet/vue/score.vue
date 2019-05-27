
<template>
    <div class="score">
        <svg xmlns="http://www.w3.org/2000/svg" width="170px" height="170px">
            <!-- <path d="M60,10 A30,30 0 0,0 60,100"
            style="stroke:#cccc00;stroke-width:8;fill:none;"/>
            <path d="M60,10 A30,30 0 0,1 60,100"
            style="stroke:#cccc00;stroke-width:8;fill:none;"/> -->
            <path v-for="(item,index) in configList" :d="item" style="stroke-width:12;fill:none;" :key="index"
                :style="{ stroke: index==Math.floor(Math.floor(scoreData)/10)-1||Math.abs(index-Math.floor(Math.floor(scoreData)/10)+1)==1?color[Math.floor(Math.floor(scoreData)/10)]:'RGBA(208, 2, 27, 0.05)',opacity:Math.abs(index-Math.floor(Math.floor(scoreData)/10)+1)==1&&Math.floor(Math.floor(scoreData)/10)>-1&&Math.floor(Math.floor(scoreData)/10)<9?'0.2':'1'}"/>
        </svg>
        <div class="scoreData" :style="{color:color[Math.floor(Math.floor(scoreData)/10)], left: (Math.floor(scoreData) + '').length<2 ? '75px' : '66px'}">
            {{Math.floor(scoreData)}}
        </div>
        <!-- <div class="scoreData1" :style="{color:color[Math.floor(scoreData)]}">
            .{{scoreData.split(".")[0]}}
        </div> -->
        <!-- <div class="Tip"> -->
            <!-- 尚可 -->
            <!-- {{$t('mxpcweb.am.1531904251947')}} -->
        <!-- </div> -->
    </div>
</template>

<script>
export default {
    name: 'tabReplySet',
    props: {
        scoreData: {
            type: String,
            default: '0'
        }
    },
    data() {
        return {
            configList: [
                'M14,109 A75,75 0 0,0 40.5,145', // 1
                'M14,63 A75,75 0 0,0 14,108', // 2
                'M40,25 A75,75 0 0,0 14,62', // 3
                'M84.5,10 A75,75 0 0,0 41.5,24', // 4
                'M128.5,24 A75,75 0 0,0 85.5,10', // 5
                'M156,62 A75,75 0 0,0 129.5,25', // 6
                'M156,108 A75,75 0 0,0 156.2,63', // 7
                'M129.5,145 A75,75 0 0,0 156,109' // 8
            ],
            color: [
                'RGBA(208, 2, 27, 1)',
                'RGBA(208, 2, 27, 1)',
                'RGBA(208, 2, 27, 1)',
                'RGBA(208, 2, 27, 1)',
                'RGBA(208, 2, 27, 1)',
                'RGBA(208, 2, 27, 1)',
                'RGBA(208, 2, 27, 1)',
                'RGBA(208, 2, 27, 1)',
                'RGBA(208, 2, 27, 1)'
            ]
        }
    }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.score{
    position: relative;
    transform:scale(.6,.6);
    -ms-transform:scale(.6,.6);
    -moz-transform:scale(.6,.6);
    -webkit-transform:scale(.6,.6);
    -o-transform:scale(.6,.6);
    .scoreData{
        font-size: 40px;
        color: #4d59c0;
        font-weight: 400;
        margin-top: -110px;
        // position: relative;
        // top:63px;
        // left:66px;
    }
    .Tip{
        position: absolute;
        top:173px;
        left:75px;
    }
    .scoreData1{
        font-weight: bold;
        position: absolute;
        top: 82px;
        left: 67px;
        font-size: 19px;
    }
}
</style>
