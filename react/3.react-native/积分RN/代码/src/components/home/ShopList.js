/**
 * Created by kerwinliu on 2018/7/2.
 */
/*
* 积分购物
* */
import React, {Component} from 'react'
import {
    View,
    TouchableHighlight,
    StyleSheet
} from 'react-native'
import {Text} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import DefaultImage from './DefaultImage'
import {sendClickPingback} from '../../common/pingback';
import {TOUCH_LIGHT_MASK} from '../../constants/touchableStyle';
import WebImage from '../WebImage';

const itemWidth = (Width - 36) / 3
export default class extends Component {
    render() {
        const {list, goToDetail} = this.props
        return (
            <React.Fragment>
                <View style={styles.titleContent}>
                    <Text style={styles.title}>购物抵现</Text>
                    <TouchableHighlight {...TOUCH_LIGHT_MASK} onPress={this._press}>
                      <View style={{flexDirection: 'row', marginRight: 13, alignItems: 'center'}}>
                        <Text style={styles.moreText}>查看更多</Text>
                        <WebImage name="912_home_arrow" style={{width: 12, height: 12, marginLeft: 4}} />
                      </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.container}>
                    <View style={styles.inner}>
                        {
                            list.map((i, index) => {
                                return (
                                    <TouchableHighlight {...TOUCH_LIGHT_MASK} onPress={() => goToDetail(i.itemIdStr, index)} style={styles.item} key={i.id}>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                              <View style={styles.imageContent}>
                                                <DefaultImage
                                                  source={i.showImage}
                                                  style={{
                                                    height: itemWidth * 0.708,
                                                    width: itemWidth * 0.708
                                                  }}
                                                  errorImageStyle={{
                                                    height: itemWidth * 0.708,
                                                    width: itemWidth * 0.708
                                                  }}
                                                />
                                              </View>
                                              <View style={styles.nameContent}>
                                                <Text numberOfLines={1} style={{fontSize: 14, color: '#333'}}>
                                                  {i.title}
                                                </Text>
                                              </View>
                                              <View style={[styles.nameContent]}>
                                                <Text numberOfLines={1} style={{fontSize: 12, color: '#FF5900'}}>
                                                  {i.scoreValue}积分抵{i.discount / 100}元
                                                </Text>
                                              </View>
                                        </View>
                                    </TouchableHighlight>
                                )
                            })
                        }
                    </View>
                </View>
            </React.Fragment>
         )
    }
    _press = () => {
        const {goTo, list} = this.props
        sendClickPingback('homeRN', '200800', 'shop_allgoods') // 积分购物查看更多按钮增加pingback
        goTo && goTo('ShoppingMall', {
            initialPage: 1,
            initialData: list
        })
    }
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center'
    },
    titleContent: {
      height: 50,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 30
    },
    inner: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 17,
      paddingHorizontal: 10
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333333',
      marginLeft: 20
    },
    item: {
      width: itemWidth,
      marginHorizontal: 2.5,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 7
    },
    imageContent: {
      width: itemWidth,
      height: itemWidth * 0.8407,
      marginBottom: 3,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F9F9F9',
      borderRadius: 4
    },
    image: {
      width: itemWidth * 0.708,
      height: itemWidth * 0.708,
    },
    nameContent: {
      width: itemWidth,
      height: 18,
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    moreButton: {
      backgroundColor: '#F9F9F9',
      width: 230,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 18
    },
    moreText: {
      color: '#666666',
      fontSize: 12,
      fontFamily: 'PingFangSC-Regular'
    }
})
