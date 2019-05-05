/**
 * Created by liuzhimeng.
 * @date 2019-01-03
 * @description 金钱花帮助按钮
 */

import React, {PureComponent} from 'react'
import {FlatList} from 'react-native'
import {connect} from 'react-redux'
import {Text, View} from '@iqiyi/rn-ui'
import WebImage from '../WebImage'
import {getObjectValueSafely} from '../../common/util'
// import {sendClickPingback} from '../../common/pingback'

@connect(
  (state) => {
    // 金钱花培育书文案
    const bookInfo = getObjectValueSafely(state, 'gardenDetail.masterGardenInfo.bookInfo')
    return {
      bookInfo
    }
  },
  null,
  null,
  {withRef: true},
)
export default class HelpModal extends PureComponent {

  render() {
    const {bookInfo = {readMe: []}} = this.props
    return (
      <WebImage name="flower/cash_book" style={styles.flowerBox}>
        <View style={styles.titleBox}>
            <View style={styles.titleLine}/>
            <Text style={styles.titleText}>金钱花培育书</Text>
            <View style={styles.titleLine}/>
        </View>
        <FlatList
          style={{flex: 1}}
          data={bookInfo.readMe}
          keyExtractor={item => item.label}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => this._renderListItem(item, index)}
          ListHeaderComponent={this._renderListHeaderComponent(bookInfo.description)}
        />
      </WebImage>
    )
  }

  _renderListHeaderComponent = (description) => {
    return <Text style={styles.flowerBoxDesc}>{description}</Text>
  }

  _renderListItem(item, index) {
    return (
      <View key={item.label} style={styles.flowerBoxParagraph}>
        <View style={styles.flowerBoxOrder}>
          <Text style={styles.flowerBoxOrderText}>{index + 1}</Text>
        </View>
        <View style={styles.flowerContent}>
          <Text style={styles.flowerContentTitle}>{item.name}</Text>
          <Text style={styles.flowerBoxParagraphText}>{this._renderRedText(item.value)}</Text>
        </View>
      </View>
    )
  }

  // 文案 红色文字 特殊处理 , 匹配 {{{中间的文字}}}
  _renderRedText = (textValue) => {
      // 分组 [123, '{{{456}}}', 789]
      try {
        const textMap = textValue.split(/({{{.*?}}})/)
        return (
          <React.Fragment>
            {
              textMap.map(this._renderActiveText)
            }
          </React.Fragment>
        )
      } catch(e){} //eslint-disable-line
  }

  _renderActiveText(text, index) {
    const isActive = text.indexOf('{') > -1
    return (
      <Text key={index} style={isActive ? styles.active : null}>
        {isActive ? text.replace(/{{{(.*?)}}}/, '$1') : text}
      </Text>
    )
  }
}

const CONTAINER_WIDTH = 310
const CONTAINER_PADDING = 20
const styles = BaseStyleSheet.create({
  container: {
    marginVertical: 7.5,
  },
  helpIcon: {
    width: 40,
    height: 43,
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  titleLine: {
    backgroundColor: '#0BBE06',
    height: 1.5,
    width: 13
  },
  titleText: {
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    color: '#333333',
    lineHeight: 25,
    fontSize: 18,
    marginHorizontal: 7
  },
  flowerBox: {
    width: CONTAINER_WIDTH,
    height: 460,
    alignItems: 'center',
    paddingBottom: 30,
  },

  helpBackWrapper: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 20,
    height: 20,
  },
  helpBackIcon: {
    width: 20,
    height: 20,
  },

  boxTitleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CONTAINER_WIDTH,
    height: 30,
    marginTop: 30,
    marginBottom: 15,
  },
  boxTitleDecoration: {
    position: 'absolute',
    left: (CONTAINER_WIDTH - 180) / 2,
    top: (30 - 4) / 2,
    width: 180,
    height: 4,
  },
  flowerBoxTitle: {
    width: 120,
    height: 20,
  },
  flowerBoxDesc: {
    paddingLeft: CONTAINER_PADDING + 20 + 8,
    paddingRight: CONTAINER_PADDING,
    fontSize: 14,
    color: '#333333',
    marginBottom: 20,
  },

  flowerBoxParagraph: {
    flex: 1,
    flexDirection: 'row',
    width: CONTAINER_WIDTH,
    paddingHorizontal: CONTAINER_PADDING,
  },

  flowerBoxOrder: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: 'rgba(11,190,6,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  flowerBoxOrderText: {
    color: '#0BBE06',
  },

  flowerContent: {
    marginBottom: 10,
  },
  flowerContentTitle: {
    height: 20,
    lineHeight: 20,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    fontSize: 14,
    color: '#333333',
  },

  flowerBoxParagraphText: {
    width: CONTAINER_WIDTH - CONTAINER_PADDING * 2 - 28,
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  active: {
    color: '#0BBE06',
  },
})
