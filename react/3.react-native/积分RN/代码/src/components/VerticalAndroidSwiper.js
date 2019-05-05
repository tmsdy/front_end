/**
 * Created by kerwinliu on 2018/6/19.
 */

import React, {Component} from 'react';
import {StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import QYSwiper from '@iqiyi/rn-swiper';
import {View, Text, Touchable} from '@iqiyi/rn-ui';
import {isIOS} from '@iqiyi/rn-utils';
import WebImage from '../components/WebImage';

const {width} = Dimensions.get('window');
const imgHeight = parseInt((width - 24) * 0.131, 10)

class NoticeSwiper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reload: false,
      newNotice: this.props.newNotice,
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.reload !== this.state.reload
  }
  render() {
    const {lastPeriodScore, clickNotice} = this.props
    const {newNotice, reload} = this.state
    if(reload || !newNotice.length) return null

    const swiperProps = isIOS ? {
      containerStyle: {height: width * 0.09},
      showsVerticalScrollIndicator: false,
      showsPagination: false,
      height: width * 0.09,
      width: width - 80,
      autoplay: true,
      removeClippedSubviews: false,
      loop: true,
      horizontal: false
    } : {
      style: swiperStyle.wrapper,
      showsButtons: false,
      showsPagination: false,
      height: imgHeight,
      width: width - 80,
      autoplay: true,
      removeClippedSubviews: false,
      loop: true,
      horizontal: false
    };

    return (
      <View style={{height: imgHeight}}>
        <QYSwiper
          {...swiperProps}
        >
          {
            newNotice.map((n) => {
              // 有限展示过期提醒
              if(n.showlastPeriodScore) {
                return (
                  <View style={swiperStyle.notice_bar} key="showlastPeriodScore">
                    <Text style={swiperStyle.notice_text} numberOfLines={1}>{`您${new Date().getFullYear() - 1}年获得的${lastPeriodScore}积分将于今年6月1日到期`}</Text>
                    <Touchable
                      containerStyle={{marginLeft: 8}}
                      style={{height: 20, width: 20, alignItems: 'center', justifyContent: 'center'}}
                      onPress={() => this.closeNotice()}
                    >
                      <WebImage name="ic_close" style={swiperStyle.close} />
                    </Touchable>
                  </View>
                )
              }
              const content = n.key_value_pair.filter(c => c.name === 'announcement')[0] ? n.key_value_pair.filter(c => c.name === 'announcement')[0].value : ''
              return (
                <TouchableOpacity
                  key={n.order}
                  activeOpacity={1}
                  onPress={() => { clickNotice(n) }}
                  style={swiperStyle.notice_bar}
                >
                  <Text style={swiperStyle.notice_text} numberOfLines={1}>{content}</Text>
                </TouchableOpacity>
              )
            })
          }
        </QYSwiper>
      </View>

    );
  }
  componentWillReceiveProps(nextProps) {
    // TODO SWIPER 组件需要升级，先这样兼容一下
    if(nextProps.newNotice.length !== this.props.newNotice.length) {
      this.setState({
        reload: true
      }, () => {
        this.setState({
          newNotice: nextProps.newNotice,
          reload: false
        })
      })
    }

  }

  closeNotice = () => {
    const newNotice = this.state.newNotice.filter(t => !t.hasOwnProperty('showlastPeriodScore'));
    this.setState({newNotice});
    this.props.updateNotice(newNotice)
  }
}

const swiperStyle = StyleSheet.create({
  notice_bar: {
    flexGrow: 1,
    alignItems: 'center',
    marginLeft: 3,
    height: imgHeight,
    flexDirection: 'row',
    paddingRight: 10
  },
  notice_text: {
    flex: 1,
    fontSize: 13,
    color: '#ff6600',
  },
  close: {
    width: 16,
    height: 16
  }
})


export default NoticeSwiper;
