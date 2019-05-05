import React, {PureComponent} from 'react'
import {
  UIManager,
} from 'react-native'
import {View} from '@iqiyi/rn-ui'

import QList from './QList'
import QuestionTitle from './QuestionTitle'
import {BG_GRADIENTVIEW_COLOR} from './QuestionConst'

import {getMultiDimensionArray} from '../../common/util'
import NoAnswer from './NoAnswer'
import {sendClickPingback} from '../../common/pingback'

// import {sendQoeMark} from '../qoe'

interface ListItemProps {
  item: any;
  index: number;
  inputBoxEnable: boolean;
  needScroll: boolean;
  goTo: Function;
  scrollTo: Function;
  answerShare: Function;
  openWeb?(): void;
}
interface ListItemState {
  bgColor: string;
}

export default class extends PureComponent<ListItemProps, ListItemState> {
  constructor(props) {
    super(props)
    this.state = {
      bgColor: BG_GRADIENTVIEW_COLOR[Math.floor(Math.random() * 3)]
    }
  }

  render() {
    const {bgColor} = this.state
    const {item, index, inputBoxEnable, needScroll, openWeb} = this.props
    return (
      <View onLayout={needScroll ? this.measureTop : null}>
        <QuestionTitle
          onPressTitle={this.answer}
          from="List"
          item={item}
          index={index}
          bgColor={bgColor}
          inputBoxEnable={inputBoxEnable}
          onPress={this.answerDirect}
          openWeb={openWeb}
        />
        {
          item.answerList.length > 0 ? (
          <QList
            {...this.props}
            data={getMultiDimensionArray(item.answerList, 4)[0]}
            hasMore={item.hasMore}
            from="List"
            share={this.share}
            readMore={this.answer}
          />
          ) : (
            <NoAnswer onPress={this.answerDirect}/>
          )
        }
      </View>
    )
  }

  share = ({
    isLike,
    uname,
    content,
    likeTotal
  }) => {
    const {answerShare, item} = this.props
    answerShare({
      isLike,
      uname,
      content,
      likeTotal,
      userSelfName: global.USER_INFO.userName,
      userSelfAvatar: global.USER_INFO.userIcon,
      questionTitle: item.content,
      wxaCode: item.wxaCode,
      qid: item.id
    })
  }

  measureTop = ({currentTarget}) => {
    const {needScroll, scrollTo} = this.props
    if(!needScroll) return false
    UIManager.measure(currentTarget, (x, y, width, height, pageX, pageY) => {
      if(needScroll && scrollTo) {
        scrollTo(pageY)
      }
    })
  }

  answerDirect = () => {
    const {index} = this.props
    sendClickPingback('hole', '', `answer${parseInt(index) + 1}`)
    this.answer({showKeyBoard: true})
  }

  answer = (params) => {
    const {showKeyBoard = false, aid = null} = params || {}
    const {goTo, item} = this.props
    goTo && goTo('QuestionDetail', {
      bgColor: this.state.bgColor,
      qid: item.id,
      aid,
      showKeyBoard
    })
  }
}
