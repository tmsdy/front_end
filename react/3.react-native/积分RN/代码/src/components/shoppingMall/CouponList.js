/**
 * Created by kerwinliu on 2018/7/13.
 */
/*
 *商城的卡券
 * */
import React , { Component } from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet
}from 'react-native'
import {
    Image,
    Text,
    ActivityIndicator
}from '@iqiyi/rn-ui'
import {
    getCouponList
} from '../../api'
import {
    Width,
    isIOS
}from '@iqiyi/rn-utils'
import QYNewList from '@iqiyi/rn-new-list'
import { getCouponImage } from '../../common/util'
import { PRODUCT_LIST  } from '../../constants/configs'
import { EmptyPage , NetError } from './EmptyPage'
import { LoadMore } from '../LoadMore'
import { DeviceModule } from '@iqiyi/rn-base-modules';
const itemWidth = Width/2,
    itemHeight = itemWidth
const NewListButton = QYNewList.Button
import DefaultImage from '../home/DefaultImage'
import { sendClickPingback } from '../../common/pingback';

export default class extends Component{
    constructor(props){
        super(props)
        const { type } = this.props
        this.state = {
            type,
            loaded:false,//默认是未加载网络
            allLoaded:false,//默认没有全部加载完成
            data:[],
            netInfo: 0 // 0 表示正常，1表示断网，2表示有网但是错误
        }
        this.pageNo = 1 // 接口分页 (默认值1)
        this.limit = 20 // 每页条数
    }
    componentDidMount(){
        this._init()
    }
    _init = ()=>{
        this._getNetInfo(this._getCouponList)
    }
    _getNetInfo = (cb) =>{
        DeviceModule.getDeviceInfo().then((data) => {
            const { networkType } = data
            this.setState({
                netInfo:networkType === 'disconnect' ? 1 : 0
            },()=>{
                if(this.state.netInfo !== 1){
                    cb && cb()
                }
            })
        }).catch(()=>{
            cb && cb()
        })
    }
    _retry =()=>{
        this.setState({
            loaded : false,
            netInfo : 0
        },()=>{
            this._init()
        })
    }
    //获取卡券列表
    _getCouponList = () => {
        const params = {
            pageNo: this.pageNo, // 接口分页 (默认值1)
            limit: this.limit, // 每页条数
            platform: isIOS ? 'ios' : 'android',
            userId: global.USER_INFO.userId,
            enterId: 3, // 用户领券入口编码
        }
        getCouponList(params).then((data) => {
            const { coupons } = data
            if (coupons && coupons.length > 0) {
                const { data } = this.state
                this.setState({
                    data:data.concat(coupons),
                    loaded:true,
                    allLoaded: 20 > coupons.length,
                    netInfo:0
                })
            }else {
                this.setState({
                    loaded:true,
                    netInfo:0
                })
            }
        }).catch(() => {
            this.setState({
                netInfo:2
            })
        })
    }

    filterData = (data)=>{
        const new_length = Math.ceil(data.length/2)
        let index = 0
        const new_arr = []
        for(index ; index < new_length ;index ++){
            const item = [
                {
                    index:index * 2,
                    data:data[index * 2]
                },
                {
                    index:index * 2 + 1,
                    data:data[index * 2 + 1]
                },
            ]
            new_arr.push(item)
        }
        return new_arr
    }

    // 点击道具详情
    clickItem = (item, index ,pageNo,i,rowid) => {
        const { goTo , openWeb , type} = this.props
       isIOS ? sendClickPingback('allgoods','110103',`all_coupon${pageNo+1}`) : sendClickPingback('allgoods','110103',`all_coupon${index+i*2+1}`)
        const clickEvent = item.exts && item.exts.filter(e => e.name === 'clickEvent')[0] &&
            item.exts.filter(e => e.name === 'clickEvent')[0].value

        if (item.url) {
            const _url = getUrl(item.url)
            openWeb(_url)
        } else if (clickEvent === 'h5') {
            const _url = item.exts.filter(e => e.name === 'h5')[0] &&
                item.exts.filter(e => e.name === 'h5')[0].value
            openWeb(_url)
        } else {
            // 精选好券跳转至精选好券详情页面，暂时用patner来区分跳转哪个详情页面，
            goTo('FeatureCoupon', {item: item ,pageNo:pageNo+1})
        }
    }

    renderRow = ({data = []},title,index,rowid)=>{
        //android newlist 渲染的高度 隔行 不一样
        const android_border = !isIOS && (!!index || index%2 !== 0)
        return (
            <View style={[styles.container,android_border ? {marginBottom:StyleSheet.hairlineWidth} : null]}>
                {
                    data.map((item,i)=>{
                        if(item.data){
                            return this._renderItem(item.data,i,rowid * 2 + i,index,rowid)
                        }
                    })
                }
                <View style={styles.bottomLine}/>
            </View>
        )
    }
    _renderItem = (item,i,pageNo,index,rowid) =>{
        //是否
        const solded = item.sendStatus === 0
        return <NewListButton onPress={()=>{ this.clickItem(item,i,pageNo,index,rowid) }} key={i}>
            <View style={[styles.item,i === 0 ? styles.borderLeft : null]}>
                <View style={styles.image}>
                    <DefaultImage
                        source={getCouponImage(item.partner,'list')}
                        style={[styles.image,{opacity:solded ? 0.5 : 1}]}
                        errorImageStyle={{height:63,width:63}}/>
                    {
                        !!solded && <View style={styles.solded}>
                            <Text style={{color:'#fff',fontSize:10}}>已兑完</Text>
                        </View>
                    }
                </View>
                <View style={[styles.nameContent,{opacity:solded ? 0.5 : 1}]}>
                    <Text numberOfLines={1} style={{fontSize:14,color:'#333'}}>
                        {item.couponName}
                    </Text>
                </View>
                <View style={[styles.nameContent,{opacity:solded ? 0.5 : 1}]}>
                    <Text numberOfLines={1} style={{fontSize:12,color:'#FF5900'}}>
                        {item.requiredIntegral}积分
                    </Text>
                </View>
            </View>
        </NewListButton>
    }
    _onEndReached = ()=>{
        const { allLoaded } = this.state
        if(!allLoaded){
            this._getNetInfo(()=>{
                this.pageNo ++
                this._getCouponList()
            })
        }
    }
    _retryLoadMore = ()=>{
        this._getNetInfo(()=>{
            this.setState({
                netInfo : 0
            },()=>{
                this._getCouponList()
            })
        })
    }
    _renderFooter = ()=>{
        const { allLoaded , netInfo } = this.state
        return <LoadMore allLoaded={allLoaded} netInfo={netInfo} retry={this._retryLoadMore}/>
    }
    render(){
        const { data , loaded , netInfo } = this.state
        const newData = data ? this.filterData(data) : null
        return (
            <View style={{flex:1,backgroundColor:'#fff',marginBottom:5}}>
                {
                    (newData && newData.length > 0) ?  <QYNewList
                        dataList={newData}
                        renderRow={this.renderRow}
                        cellHeightPossible={itemHeight}
                        onEndReached={this._onEndReached}
                        onEndReachedThreshold={10}
                        renderFooter={this._renderFooter}
                    /> : (loaded && netInfo === 0)? <EmptyPage/> : netInfo === 0 ? <View style={styles.centerBox}>
                        <ActivityIndicator text="内容即将呈现..." />
                    </View> : null
                }
                {
                    (netInfo !== 0 && (!newData || newData.length <= 0)) && <NetError netInfo={netInfo} retry={this._retry}/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:Width,
        flexDirection:'row',
        flexWrap:'wrap',
    },
    image:{
        width:113 ,
        height:63 ,
        marginBottom:9.5
    },
    item:{
        width:itemWidth,
        paddingTop:20 ,
        paddingBottom:15,
        alignItems:'center'
    },
    borderLeft:{
        borderRightWidth:StyleSheet.hairlineWidth,
        borderRightColor:'#E3E3E3'
    },
    nameContent:{
        width:itemWidth - 40,
        height:20,
        justifyContent:'center',
        alignItems:"center",
    },
    solded:{
        position:'absolute',
        width:45,
        height:45,
        top:9,
        left:34,
        borderRadius:22.5,
        backgroundColor: 'rgba(0,0,0,0.50)',
        justifyContent:'center',
        alignItems:'center'
    },
    centerBox: {
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomLine:{
        width:Width,
        height:StyleSheet.hairlineWidth,
        backgroundColor:'#e3e3e3',
        position:'absolute',
        bottom:0,
        left:0
    }
})
