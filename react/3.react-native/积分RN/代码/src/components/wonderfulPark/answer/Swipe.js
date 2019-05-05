import React, {PureComponent} from 'react'
import Swiper from '@iqiyi/react-native-deck-swiper'
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native'
import Card from './Card'
import px2dp from '../../../common/px2dp'
import WebImage from '../../WebImage'
import {getAsyncStoragePromise, saveAsyncStoragePromise} from '../../../common/asyncStorage'
import {sendClickPingback} from '../../../common/pingback'

const ANSWER_GUIDE_TIPS = 'ANSWER_GUIDE_TIP3123'
export default class extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      swipedAllCards: false,
      showGuide: false // 新手引导
    }
  }
  componentDidMount() {
    sendClickPingback('paradise', 296011, 'hole_1')
    getAsyncStoragePromise(ANSWER_GUIDE_TIPS).then((d) => {
      if(!d) {
        this.setState({showGuide: true})
      }
    })
  }

  render() {
    const {swipedAllCards, showGuide} = this.state
    const {list} = this.props
    if(list.length === 1) {
      return <View style={[styles.container, {paddingTop: px2dp(7.5), paddingHorizontal: px2dp(20)}]}><Card item={list[0]} {...this.props} index={0}/></View>
    }
    return (
      <View style={styles.container}>
        <Swiper
          infinite={true}
          cards={list}
          cardVerticalMargin={px2dp(7.5)}
          renderCard={this.renderCard}
          onSwipedAll={this.onSwipedAllCards}
          onSwipedLeft={this.onSwiped}
          onSwipedRight={this.onSwiped}
          // dragStart={() => { this.setScroll(false) }}
          dragEnd={() => { this.setScroll(true) }}
          onSwiping={() => { this.setScroll(false) }}
          stackSize={2}
          stackSeparation={5}
          verticalSwipe={false}
          backgroundColor="transparent"
          cardHorizontalMargin={px2dp(20)}
          horizontalSwipe={!swipedAllCards}
          outputRotationRange={['0deg', '0deg', '0deg']}
          disableRightSwipe={true}
          horizontalThreshold={10}
        />
        {
          showGuide ?
          <TouchableWithoutFeedback onPress={this.hideBg}>
            <View style={styles.guide}>
              <Text style={{fontSize: px2dp(16), color: '#fff'}}>滑动切换更多回答</Text>
              <WebImage name="answer/point" style={styles.point}/>
            </View>
          </TouchableWithoutFeedback> : null
        }
      </View>
    )
  }
  hideBg = () => {
    const {showGuide} = this.state
    // 点击关闭引导
    if(showGuide) {
      this.setState({showGuide: false})
      saveAsyncStoragePromise(ANSWER_GUIDE_TIPS, 1)
    }
  }
  setScroll = (status = true) => {
    const {setScrollEnabled} = this.props
    try {
      setScrollEnabled && setScrollEnabled(status)
    } catch(e) {
      setScrollEnabled && setScrollEnabled(true)
    }
  }
  renderCard = (card, index) => {
    return (
      <Card item={card} {...this.props} index={index}/>
    )
  };

  onSwiped = (cardIndex) => {
    const {list} = this.props
    sendClickPingback('paradise', 296011, `hole_${parseInt(cardIndex) + 1}`)
    if(cardIndex === list.length - 1) {
      this.onSwipedAllCards()
    }
  }

  onSwipedAllCards = () => {
    this.props.getDataList()
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    width: px2dp(375),
    height: px2dp(180),
    overflow: 'hidden'
  },
  guide: {
    width: px2dp(335),
    height: px2dp(150),
    position: 'absolute',
    top: px2dp(7.5),
    left: px2dp(20),
    backgroundColor: '#000',
    opacity: 0.6,
    borderRadius: px2dp(10),
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: px2dp(35),
  },
  point: {
    marginTop: px2dp(17.5),
    width: px2dp(40),
    height: px2dp(40)
  }
})
