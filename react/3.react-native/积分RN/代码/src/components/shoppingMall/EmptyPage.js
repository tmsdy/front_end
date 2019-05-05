/**
 * Created by kerwinliu on 2018/7/3.
 */
import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import {
    isIOS
} from '@iqiyi/rn-utils'
import {QYRNBridge} from '@iqiyi/rn-base-modules';
import {
    Image,
    Text
} from '@iqiyi/rn-ui'
import LinearGradient from '@iqiyi/rn-gradient-view';
import WebImage from '../WebImage'

import {NETWORK_ERROR} from '../../constants/configs'
import {BG_GRADIENT_START, BG_GRADIENT_END} from '../../constants/baseStyles';

export class LoginContent extends Component {
    render() {
        const {onPress = () => null} = this.props
        return (
            <View style={styles.container}>
                <WebImage style={styles.emptyImage} name="none" />
                <Text style={styles.emptyText}>登录看看我能兑什么</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={onPress}
                  activeOpacity={0.8}
                >
                    <Text style={styles.emptyBtnText}>登录一下</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
// 空态
export class EmptyPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <WebImage style={styles.image} name="none" />
                <Text style={styles.text}>还没有商品哦，先看看其他分类吧</Text>
            </View>
        )
    }
}
// 通用空组件
export const CustomEmptyPage = ({btnOnPress = null, emptyText = '你的积分太少啦，还没有能兑的商品', gradientStyle, btnText = '赚点积分', buttonTextStyle = {}, emptyTextStyle = {}}) => {
    return (
      <View style={styles.container}>
        <WebImage style={styles.emptyImage} name="none" />
        <Text style={[styles.text, emptyTextStyle]}>{emptyText}</Text>
        <TouchableOpacity onPress={() => btnOnPress()}>
          <LinearGradient style={[styles.gradient, gradientStyle]} start={{x: 0, y: 1}} end={{x: 1, y: 1}} colors={[BG_GRADIENT_START, BG_GRADIENT_END]}>
            <Text style={[styles.buttonText, buttonTextStyle]}>{btnText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };
// 断网或者网络故障
export class NetError extends Component {
    render() {
        const {retry} = this.props
        return (
            // <TouchableOpacity
            //   style={styles.container}
            //   activeOpacity={1}
            //   onPress={() => {
            //     if(netInfo !== 1) {
            //         retry && retry()
            //     }
            //   }}
            // >
            //     <Image source={{uri: isIOS ? 'click_reload' : 'phone_empty_data_img'}} style={styles.unlinkPic} />
            //     <Text style={[styles.text, textStyle]}>{netInfo === 1 ? '网络未连接，请检查网络设置' : '网络繁忙，请点击重试...'}</Text>
            // </TouchableOpacity>
            <View style={styles.networkError} activeOpacity={1}>
                <Image source={{uri: isIOS ? 'click_reload' : 'phone_empty_data_img'}} style={styles.unlinkPic} />
                <View style={styles.errorTextWrap}>
                    <Text style={styles.errorText}>网络异常，</Text>
                    <TouchableOpacity onPress={() => QYRNBridge.navigate(JSON.stringify(NETWORK_ERROR))}>
                        <Text style={styles.errorResolve}>查看解决方案</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.retry} onPress={retry}>
                    <Text style={styles.retryText}>点击重试</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    },
    image: {width: 163.4, height: 123.6},
    text: {color: '#666666', fontSize: 14, marginTop: 20.1},
    unlinkPic: {
        width: 164,
        height: 120.5
    },
    emptyImage: {
        width: 155,
        height: 112.5
      },
    button: {
        borderRadius: 24,
        borderWidth: 1.5,
        borderStyle: 'solid',
        borderColor: '#FF7E00',
        width: 90,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    emptyText: {
        color: '#666666',
        fontSize: 14,
        marginTop: 45
      },
      emptyBtnText: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#FF7E00'
      },
      networkError: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1
      },
      errorTextWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      },
      errorText: {
        color: '#666',
        fontSize: 14
      },
      errorResolve: {
        color: '#0BBE06',
        fontSize: 14
      },
      retry: {
        width: 80,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28
      },
      retryText: {
        fontSize: 13,
        lineHeight: 16,
        color: '#666',
      },
      gradient: {
        width: 180,
        height: 40,
        borderRadius: 20,
        marginTop: 37,
        justifyContent: 'center',
        alignItems: 'center'
      },
      buttonText: {
          fontFamily: 'PingFangSC-Regular',
          fontSize: 16,
          color: '#ffffff'
      }
})
