/**
 * 由于错序排列，需要制造符合ui结构的数据，4个数据一组
 * [[{长},{短},{短},{长}]]
 *  */
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  View,
  Text
} from '@iqiyi/rn-ui'
import {
  Width
} from '@iqiyi/rn-utils'
import px2dp from '../../common/px2dp'
import QuestionItem from './QuestionItem'
import WebImage from '../WebImage'

export default class extends PureComponent {
  static defaultProps = {
    data: {},
    from: 'List' // 区分是详情页还是乐园页面
  }
  static propTypes = {
    data: PropTypes.object,
    from: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      hasOwnAnswer: false // 用户自己的回答排在第一位，左右排序有所变化
    }
  }
  render() {
    const {data} = this.props
    return (
      <React.Fragment>
        {
          data && data.item ? this.renderEachContent(data) : this.renderEmpty()
        }
      </React.Fragment>
    )
  }
  renderEmpty = () => {
    return null;
  }
  // 以四个为一大块进行渲染 再内部分成左右
  renderEachContent = ({item}) => {
    // console.log(item)
    const {hasMore, from, readMore} = this.props
    if(item.length === 1 && item[0].realIndex === 0) {
      // 只有一条回答的特殊样式
      return this.renderOne(item[0])
    }
    if(item.length === 2 && item[0].realIndex === 0) {
      return this.renderTwo(item)
    }
    const LeftList = item.filter((d, index) => index % 2 === 0)
    const RightList = item.filter((d, index) => index % 2 === 1)
    // if(type === 'short'){}
    return (
      <View style={{alignItems: 'center', paddingBottom: from === 'List' ? px2dp(62) : 0}}>
        <View style={styles.container}>
          <View style={styles.half}>
            {this._renderDiff(LeftList, 'left')}
          </View>
          <View style={styles.half}>
            {this._renderDiff(RightList, 'right')}
          </View>
        </View>
        {
          from === 'List' && hasMore ?
          <TouchableOpacity activeOpacity={1} style={styles.more} onPress={readMore}>
            <Text style={styles.moreText}>查看更多</Text>
            <WebImage name="ic_arrow_small" style={styles.moreIcon}/>
          </TouchableOpacity> : null
        }
      </View>
    )
  }
  // 渲染左右两侧的item
  _renderDiff = (list, type) => {
    return (
      <React.Fragment>
        {
          list.slice(0, list.length).map((item, index) => {
            return this._renderItem(item, index, type)
          })
        }
      </React.Fragment>
    )
  }
  renderOne = ({data, realIndex}) => {
    const {from, readMore} = this.props
    return (
      <View style={{alignItems: 'center', paddingBottom: from === 'List' ? px2dp(35) : 0}}>
        <QuestionItem
          {...this.props}
          item={data}
          index={realIndex}
          itemType="maxLong"
          from={from}
          readMore={readMore}
        />
      </View>
    )
  }
  renderTwo = (item) => {
    return (
      <View style={[styles.container, {paddingBottom: px2dp(35)}]}>
        <View style={styles.half}>
          {this._renderDiff([item[0]], 'left')}
        </View>
        <View style={styles.half}>
          {this._renderDiff([item[1]], 'right')}
        </View>
      </View>
    )
  }
  _renderItem({data, realIndex}, index, type = 'left') {
    if(!data) return null
    // 真实序号
    const itemType = this._getItemType(type, index)
    const {from, readMore} = this.props
    return (
      <QuestionItem
        {...this.props}
        key={data.id}
        item={data}
        index={realIndex}
        itemType={itemType}
        from={from}
        readMore={readMore}
      />
    )
  }

  _getItemType(type, index) {
    const {hasOwnAnswer} = this.state;
    let itemType = 'short'
    // 有自己回答，第一个是短card
    if(hasOwnAnswer) {
      if(type === 'left') {
        itemType = index % 2 === 0 ? 'short' : 'long'
      } else {
        itemType = index % 2 === 1 ? 'short' : 'long'
      }
    } else if(type === 'left') {
      itemType = index % 2 === 1 ? 'short' : 'long'
    } else {
      itemType = index % 2 === 0 ? 'short' : 'long'
    }
    return itemType
  }
}

const styles = StyleSheet.create({
  container: {
    width: Width,
    flexDirection: 'row',
    paddingHorizontal: px2dp(13.5),
    backgroundColor: '#F2F2F2'
  },
  half: {
    flex: 1,
    alignItems: 'center'
  },
  more: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: px2dp(30)
  },
  moreIcon: {
    width: 12,
    height: 12,
    marginLeft: px2dp(3.25)
  },
  moreText: {
    color: '#999',
    fontSize: px2dp(12),
  }
})
