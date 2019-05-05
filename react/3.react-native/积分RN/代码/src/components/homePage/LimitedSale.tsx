/**
 * Created by liuzhimeng.
 * @date 2019-04-23
 * @description 积分中心秒杀活动
 */

import React, {PureComponent} from 'react'
import {FlatList} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'
import {Width} from '@iqiyi/rn-utils'
import LinearGradient from '@iqiyi/rn-gradient-view'

import BaseStyleSheet from '../../common/BaseStyleSheet'
import WebImage from '../WebImage'
import BaseButton from '../BaseButton'

import ProductItem from './ProductItem'
import ProductDescription from './ProductDescription'

import {formatCountDownTime} from '../../common/util'
import {sendBlockPingback, sendClickPingback} from '../../common/pingback'

interface LimitedSaleProps {
  code: string;
  time: number;
  list: any[];
  goTo(pageName: string, config: any): void;
}

export default class LimitedSale extends PureComponent<LimitedSaleProps, {}> {
  componentDidMount() {
    sendBlockPingback('pointcenter', 2110)
  }

  render() {
    const {list} = this.props
    if(!list.length) return null

    return (
      <View style={styles.container}>
        <LinearGradient colors={['#FFF2C0', '#FFFAE3']} style={styles.gradient}/>
        <View style={styles.titleWrapper}>
          <WebImage style={styles.titleIamge} name="homepage/limited-sale" />
          {this.renderCountDown()}
        </View>
        <FlatList
          style={styles.listWrapper}
          data={this.props.list}
          keyExtractor={({itemId}) => String(itemId)}
          renderItem={this.renderItem}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )
  }

  renderItem = ({item, index}) => {

    return (
      <ProductItem
        data={item}
        renderDescComponent={this.renderDesc(item)}
        renderBottomComponent={(
          <BaseButton
            text="抢"
            textColor="#ffffff"
            containerStyle={{width: 70, marginTop: 8}}
            textStyle={{color: '#ffffff'}}
            onPress={() => this.onItemPress(item, index)}
          />
        )}
        containerStyle={{
          width: 130,
          height: 175,
          backgroundColor: '#ffffff',
          borderRadius: 4,
          paddingTop: 5,
          paddingBottom: 0,
          marginRight: index === this.props.list.length - 1 ? 20 : 7.5,
          marginLeft: index === 0 ? 20 : 0
        }}
        onPress={() => this.onItemPress(item, index)}
      />
    )
  }

  renderCountDown = () => {
    const {time} = this.props
    const result = time - Date.now()
    const countdownTime = result > 0 ? result : 0
    const [day, hour, minute, second] = formatCountDownTime(countdownTime)
    let Countdown = null
    if(day.time > 0) {
      Countdown = (
        <React.Fragment>
          {this.renderTime(day.text)}
          <Text style={styles.countdownText}>天</Text>
          {this.renderTime(hour.text)}
          <Text style={styles.countdownText}>小时</Text>
        </React.Fragment>
      )
    } else {
      Countdown = (
        <React.Fragment>
          {this.renderTime(day.text)}
          <Text style={styles.countdownText}>:</Text>
          {this.renderTime(minute.text)}
          <Text style={styles.countdownText}>:</Text>
          {this.renderTime(second.text)}
        </React.Fragment>
      )
    }

    return (
      <View style={styles.countdown}>
        <Text style={styles.countdownText}>距结束</Text>{Countdown}
      </View>
    )
  }

  renderTime = (text: string) => {
    return (
      <View style={styles.timeWrapper}>
        <Text style={styles.timeText}>{text}</Text>
      </View>
    )
  }

  renderDesc = ({score, originalPrice}) => {
    return <ProductDescription score={score} originalPrice={originalPrice} />
  }

  onItemPress = ({name, itemId}, index: number) => {
    sendClickPingback('pointcenter', 2110, `miaosha_${index + 1}`)
    this.props.goTo('GoodsDetail', {
      name,
      itemId,
      code: this.props.code,
    })
  }

}

const styles = BaseStyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 26,
    marginBottom: 10,
  },
  gradient: {
    ...BaseStyleSheet.absoluteFillObject,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingLeft: 20,
    paddingRight: 10,
  },
  titleIamge: {
    width: 80,
    height: 18,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  countdownText: {
    color: '#333333',
    fontSize: 14,
  },
  timeWrapper: {
    alignItems: 'center',
    height: 15,
    marginHorizontal: 2,
    paddingHorizontal: 4,
    backgroundColor: '#222222',
    borderRadius: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#ffffff',
  },

  listWrapper: {
    width: '100%',
    // paddingLeft: 20,
    // paddingRight: 12.5,
  },
})
