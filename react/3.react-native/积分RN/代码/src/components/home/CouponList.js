/**
 * Created by kerwinliu on 2018/7/2.
 */
/*
*首页的道具和卡券列表
* */
import React , { Component } from 'react'
import {
    View,
    TouchableHighlight,
    StyleSheet
}from 'react-native'
import {
    Image,
    Text
}from '@iqiyi/rn-ui'
import {
    Width
}from '@iqiyi/rn-utils'
import { getCouponImage } from '../../common/util'
const itemWidth = (Width - 21)/3 - 10
import DefaultImage from './DefaultImage'
import {TOUCH_COLORFUL_MASK, TOUCH_LIGHT_MASK} from '../../constants/touchableStyle';

export default class extends Component{

    _press = ()=>{
        const { goTo } = this.props
        goTo && goTo('ShoppingMall',{
            initialPage:2
        })
    }

    render(){
        const { list , goToDetail , title } = this.props
        return (
            <React.Fragment>
                <View style={styles.titleContent}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View style={{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:10.5}}>
                    {
                        list.slice(0,3).map((item,index)=>{
                            return (
                                <TouchableHighlight activeOpacity={1} underlayColor="transparent" onPress={() => goToDetail(item, index)} style={styles.item} key={index}>
                                    <View style={{flex: 1, justifyContent:'center', alignItems:'center',}}>
                                          <View style={[{borderRadius:3},styles.image]}>
                                            <DefaultImage
                                              source={getCouponImage(item.partner,'list')}
                                              style={[styles.image,{opacity:item.sendStatus === 0   ? 0.5 : 1}]}
                                              errorImageStyle={{height:itemWidth * 0.5575,width:itemWidth * 0.5575}}/>
                                            {
                                              item.sendStatus === 0  && <View style={styles.solded}>
                                                <Text style={{color:'#fff',fontSize:10}}>已兑完</Text>
                                              </View>
                                            }
                                          </View>
                                          <View style={[styles.nameContent,{opacity:item.sendStatus === 0  ? 0.5 : 1}]}>
                                            <Text numberOfLines={1} style={{fontSize:14,color:'#333'}}>
                                              {item.couponName.length > 7 ? item.couponName.substr(0,5) + '...' : item.couponName}
                                            </Text>
                                          </View>
                                          <View style={[styles.nameContent,{height:17},{opacity:item.sendStatus === 0 ? 0.5 : 1}]}>
                                            <Text numberOfLines={1} style={{fontSize:12,color:'#FF5900'}}>
                                              {item.requiredIntegral}积分
                                            </Text>
                                          </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>
                {
                     <View style={styles.container}>
                         <TouchableHighlight {...TOUCH_LIGHT_MASK} style={styles.moreButton} onPress={this._press}>
                            <Text style={{color:'#333'}}>查看更多</Text>
                         </TouchableHighlight>
                     </View>
                }
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
    },
    titleContent:{
        height:45,
        justifyContent:'center',
    },
    title:{
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginLeft:20
    },
    item:{
        width:itemWidth,
        marginHorizontal:5,
        justifyContent:'center',
        alignItems:'center',
    },
    moreButton:{
        backgroundColor:'#F9F9F9',
        width:150,
        height:40,
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        marginVertical:15
    },
    image:{
        width:itemWidth,
        height:itemWidth * 0.5575,
        marginBottom:7
    },
    nameContent:{
        width:itemWidth,
        height:20,
        justifyContent:'center',
        alignItems:"center",
    },
    solded:{
        position:'absolute',
        width:45,
        height:45,
        top:(itemWidth * 0.5575 - 45)/2,
        left:(itemWidth - 45)/2,
        borderRadius:22.5,
        backgroundColor: 'rgba(0,0,0,0.50)',
        justifyContent:'center',
        alignItems:'center'
    }
})
