/**
 * 倒计时
 */
import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';

export default class CountDown extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if(prevState.secKillLeftTime !== nextProps.secKillLeftTime) {
      return {
        startTime: new Date().getTime() + nextProps.secKillLeftTime,
        secKillLeftTime: nextProps.secKillLeftTime
      };
    }
    return {
      startTime: prevState.startTime ? prevState.startTime : (new Date().getTime() + prevState.secKillLeftTime),
    };
  }
  state = {
    countDownTime: null,
    startTime: null,
    secKillLeftTime: this.props.secKillLeftTime
  };

  componentDidMount() {
    this.countDownTimer = setInterval(this.startCountTime, 100);
  }
  componentWillUnmount() {
    this.countDownTimer && clearInterval(this.countDownTimer);
  }
  render() {
    const {countDownTime} = this.state;
    if(!countDownTime) return null;
    return (
      <View style={styles.seckillTimeWrap}>
        <Text style={styles.seckillText}>距结束：</Text>
        <Text style={styles.seckillTime}>{countDownTime}</Text>
      </View>
    );
  }
  countDownTimer = null; // 倒计时定时器
  // 倒计时函数
  startCountTime = () => {
    const now = new Date().getTime();
    // 拿到当前时间和过期时间之间的时间差（毫秒）
    const deltaTime = this.state.startTime - now; // 到期时间和当前时间相差的毫秒数
    // 如果超时了，就停止倒计时
    if(deltaTime <= 0) {
      // 停止计时器
      clearInterval(this.countDownTimer);
      this.setState(
        {
          countDownTime: null
        },
        () => {
          this.props.initData();
        }
      );
      // 停止执行下面的代码
      return;
    }
    // 已知毫秒数，算出几分几秒几秒
    const m = Math.floor(deltaTime / (60 * 1000));
    // 算出有多少秒
    const s = Math.floor((deltaTime / 1000) % 60);
    // 算出多少毫秒, 毫秒数只显示10位和百位
    const ms = Math.floor((deltaTime % 1000) / 10);
    // 把时间的数字转成字符串， 如果分秒毫秒不足10， 则前面补0
    const timeStr = `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}:${ms < 10 ? `0${ms}` : ms}`;
    this.setState({
      countDownTime: timeStr
    });
  };
}

const styles = BaseStyleSheet.create({
  seckillTimeWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seckillText: {
    opacity: 0.6,
    fontFamily: 'PingFangSC-Regular',
    fontSize: 11,
    color: '#FFFFFF'
  },
  seckillTime: {
    fontFamily: 'PingFangSC-Medium',
    fontSize: 12,
    color: '#E4FF00',
    width: 50
  }
});
