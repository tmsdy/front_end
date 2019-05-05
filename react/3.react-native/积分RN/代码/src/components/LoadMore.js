/**
 * Created by kerwinliu on 2018/7/13.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  isIOS,
} from '@iqiyi/rn-utils'
import {
  Image,
  Text,
  ActivityIndicator,
} from '@iqiyi/rn-ui'
import {QYRNBridge} from '@iqiyi/rn-base-modules';
import {NETWORK_ERROR} from '../constants/configs'

// 断网或者网络故障
export class LoadMore extends Component {
  render() {
    return (
      <React.Fragment>
        {this._renderMore()}
      </React.Fragment>
    )
  }
  netErrorList = [1, 2]
  _renderMore = () => {
    const {
      allLoaded,
      netInfo,
      showImage,
      retry = () => null,
      noMoreText = '别拉了，到底啦！'
    } = this.props

    if(allLoaded) {
      return (
        <View style={styles.footer}>
          <View style={styles.lines}/>
          <Text style={styles.noMoreText}>{noMoreText}</Text>
          <View style={styles.lines}/>
        </View>
      )
    }
    // if(netInfo === 1) {
    //   return (
    //     <View style={styles.networkError}>
    //       {showImage &&
    //       <Image style={styles.unlinkPic} source={{uri: isIOS ? 'click_reload' : 'phone_empty_data_img'}}/>}
    //       <Text style={styles.text}>网络未连接，请检查网络设置</Text>
    //     </View>
    //   )
    // }
    if(this.netErrorList.includes(netInfo)) {
      return (
        <View style={styles.networkError} activeOpacity={1}>
          {showImage &&
          <Image source={{uri: isIOS ? 'click_reload' : 'phone_empty_data_img'}} style={styles.unlinkPic}/>}
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
    return (
      <View style={styles.loading}>
        <ActivityIndicator text="加载中..." style={{height: 12, width: 12}}/>
      </View>
    )
  }
}

LoadMore.propTypes = {
  allLoaded: PropTypes.bool,
  showImage: PropTypes.bool,
  netInfo: PropTypes.number,
  retry: PropTypes.func,
}

LoadMore.defaultProps = {
  allLoaded: false,
  showImage: false,
  netInfo: 0,
  retry: () => null,
}

const styles = StyleSheet.create({
  networkError: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  loading: {
    height: 22,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  unlinkPic: {
    width: 164,
    height: 120.5,
  },
  text: {
    marginTop: 20,
    color: '#666666',
    fontSize: 14,
  },
  footer: {
    height: 17,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 15
  },
  lines: {
    width: 50,
    height: 1,
    borderRadius: 1.5,
    backgroundColor: '#ddd'
  },
  noMoreText: {
    fontSize: 12,
    color: '#b3b3b3',
    marginHorizontal: 10,
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
  }
})
