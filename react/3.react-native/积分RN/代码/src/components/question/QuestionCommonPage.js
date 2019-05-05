import React, {PureComponent} from 'react'
import {
  PurePage
} from '@iqiyi/rn-navigation'
import {
  View,
  StyleSheet,
  // Text,
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native'
import {
  riskControl
} from '../../api'
import NavBar from '../DefaultNavBar'
import QList from '../question/QList'
import QuestionTitle from '../question/QuestionTitle'
import {BG_GRADIENTVIEW_COLOR} from '../question/QuestionConst'
import {CustomEmptyPage} from '..//EmptyPage'
import {
  getQuestionList
} from '../../model/question/index'
import WebImage from '../WebImage'
import Tips from '../question/Tips'

// const TEST_DATA = {
//   "contentList": [
//       {
//           "id": 4807304887700101,
//           "content": "振宇小哥哥在哪里，6666？",
//           "description": null,
//           "group": null,
//           "uid": 0,
//           "ctime": 1548073049067,
//           "utime": 1548409763466,
//           "answerCount": 2278,
//           "status": 0,
//           "order": 1,
//           "verticalCode": "verticalCode",
//           "typeCode": "typeCode",
//           "pic": null,
//           "answerList": [
//               {
//                   "isLike": 0,
//                   "avatar": "https://img7.iqiyipic.com/passport/20181216/e2/1e/passport_2478064464_154493255234417_130_130.jpg",
//                   "uname": "媳妇不在家啦啦啦",
//                   "likeTotal": 100,
//                   "id": 4814643928700900,
//                   "qid": 4807304887700101,
//                   "content": "振宇小哥哥又来了2",
//                   "uid": 2478064464,
//                   "status": 0,
//                   "ctime": 1548146439296,
//                   "utime": 1548149901074
//               },
//               {
//                   "isLike": 0,
//                   "avatar": "https://img7.iqiyipic.com/passport/20181216/e2/1e/passport_2478064464_154493255234417_130_130.jpg",
//                   "uname": "媳妇不在家啦啦啦",
//                   "likeTotal": 0,
//                   "id": 4823113053500400,
//                   "qid": 4807304887700101,
//                   "content": "是谁邀请老子回答这个的",
//                   "uid": 2478064464,
//                   "status": 0,
//                   "ctime": 1548231130663,
//                   "utime": 1548327245555
//               },
//               {
//                   "isLike": 0,
//                   "avatar": "https://img7.iqiyipic.com/passport/20181216/e2/1e/passport_2478064464_154493255234417_130_130.jpg",
//                   "uname": "媳妇不在家啦啦啦",
//                   "likeTotal": 0,
//                   "id": 4823111255600300,
//                   "qid": 4807304887700101,
//                   "content": "再多的承诺",
//                   "uid": 2478064464,
//                   "status": 0,
//                   "ctime": 1548231112680,
//                   "utime": 1548327245555
//               },
//           ],
//           "hasAnswered": 1
//       }
//   ],
//   "total": 1,
//   "isEnd": true
// }

export const getQuestionCommonPage = (WrappedComponent, {pageState: {offset, limit}}) =>
  class WithWrappedComponent extends PurePage {
    constructor(props) {
      super(props)
      this.state = {
        emptyShowName: 'loading',
        emptyTip: '',
        contentDisplayEnable: false, // 风控默认是关闭 true 为展示
        inputBoxEnable: false
      }
    }
    componentDidMount() {
      StatusBar.setBarStyle('dark-content', true)
      this._getRiskState()
    }
    render() {
      const {contentDisplayEnable, inputBoxEnable, emptyShowName, emptyTip} = this.state
      return (
        <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>
          <NavBar
            title="脑洞大赏"
            type="black"
            titleColor="#333333"
            backgroundColor="#ffffff"
            backPress={this.back}
            renderRightView={this.renderRightView}
          />
          <CustomEmptyPage emptyTip={emptyTip} showName={emptyShowName}>
            <WrappedComponent
              contentDisplayEnable={contentDisplayEnable}
              inputBoxEnable={inputBoxEnable}
            />
          </CustomEmptyPage>
          <Tips ref={(tipsrefs) => { this.tipsrefs = tipsrefs }}/>
        </View>
      )
    }
    renderRightView = () => {
      return (
        <TouchableOpacity style={styles.headerRight} activeOpacity={1} onPress={this.showTips}>
          <WebImage name="answer/question_icon" style={{width: 43, height: 43}}/>
        </TouchableOpacity>
      )
    }
    showTips = () => {
      this.tipsrefs.showTips(true)
    }
    // 云控失败默认展示
    _getRiskState() {
      riskControl({
        qypid: global.CLIENT_INFO.qyId || global.CLIENT_INFO.deviceId
      }).then(({contentDisplayEnable, inputBoxEnable}) => {
        this.hideNativeLoading()
        this.setState({
          contentDisplayEnable,
          inputBoxEnable,
          emptyShowName: contentDisplayEnable ? 'content' : 'empty',
          emptyTip: contentDisplayEnable ? '空空如也，问题制作中' : 'ops,页面藏起来了'
        })
      }).catch(() => {
        this.hideNativeLoading()
        this.setState({contentDisplayEnable: true, inputBoxEnable: true, emptyShowName: 'content'})
      })
    }
  }


const styles = StyleSheet.create({
  headerRight: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
