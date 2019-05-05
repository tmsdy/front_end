import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  View,
  Text,
  Image
} from '@iqiyi/rn-ui'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {changeAnswerItem} from '../../actions/changeQuestionAnswerItem'
import {showToast} from '../../common/QYNativeBridge'
import px2dp from '../../common/px2dp'
import WebImage from '../WebImage'
import {like, unLike} from '../../model/question'
import {goToPGC, filterExts} from '../../common/util'
import {sendClickPingback} from '../../common/pingback'


const getContentHeight = (itemType) => {
  if(itemType === 'maxLong') {
    return px2dp(120)
  }
  if(itemType === 'short') {
    return px2dp(140)
  }
  return px2dp(175)
}
@connect(null, dispatch => bindActionCreators({changeAnswerItem}, dispatch))
export default class extends Component {
  static defaultProps = {
    itemType: 'short', // 长短回答 或者唯一回答
    index: 0, // 序号
    item: {} // 回答内容
  }
  static propTypes = {
    index: PropTypes.number,
    itemType: PropTypes.string,
    item: PropTypes.object
  }
  static getDerivedStateFromProps(nextProps) {
    const {item} = nextProps
    // const {id, utime} = prevState
    if(item.id && item.utime) {
      // 数据更新 id 改变或者是 更新时间了，说明数据发生了变化
      return {
        // id: item.id,
        isLike: item.isLike,
        likeTotal: item.likeTotal || 0,
        // utime: item.utime
      }
    }
    return null
  }
  constructor(props) {
    super(props)
    const {item, itemType, from} = this.props
    this.state = {
      // id: item.id,
      defaultViewMore: from !== 'List', // 非列表页默认展开
      isLike: item.isLike,
      likeTotal: item.likeTotal || 0,
      firstLoad: true, // 初次加载 默认展示全部内容，方便判断是否显示查看更多
      needShowMoreText: false, // 是否需要展示更多按钮 ,在初次加载时候状态可能改变
      isOneStyle: itemType === 'maxLong', // 只有一个回答
      isShortStyle: itemType === 'short', // 是否是短的回答
      contentHeight: getContentHeight(itemType) // 默认高度
      // utime: item.utime // 更新时间
    }
    this.loading = false // 防快速点击
  }

  render() {
    const {item, index, openWeb, medal, share, readMore} = this.props
    const {isLike, likeTotal, needShowMoreText, isShortStyle, isOneStyle, firstLoad, defaultViewMore} = this.state
    // index 是经过处理的真实序号
    // if(type === 'short'){}
    const shortStyle = isShortStyle ? styles.shortContent : {}
    let numberOfLines = isShortStyle ? 2 : 3
    numberOfLines = isOneStyle ? 1 : 2
    const hasMedal = medal[item.uid] && medal[item.uid][0]
    return (
      <TouchableOpacity
        style={[styles.itemLongContent, shortStyle, isOneStyle && styles.itemMaxLongContent, (firstLoad || (defaultViewMore && needShowMoreText)) && {height: 'auto'}]}
        onLayout={!firstLoad ? null : this.layoutText}
        onPress={defaultViewMore ? null : readMore}
        activeOpacity={1}
      >
        {/* {
          index === 0 && !isOneStyle && <WebImage name="answer/first_answer" style={styles.first_answer}/>
        } */}
        {
          index === 0 && <WebImage name="answer/hot_bg_left" style={styles.first_top}/>
        }
        {
          index === 0 && <WebImage name="answer/hot_bg_right" style={styles.first_right}/>
        }
        {
          index === 0 && <WebImage name="answer/hot_bg_right_fire" style={styles.hot_bg_right_fire}/>
        }
        <TouchableOpacity style={styles.user} onPress={() => { goToPGC({openWeb, uid: item.uid}) }}>
          <Image source={{uri: item.avatar}} style={styles.avatar}/>
          <View style={{maxWidth: hasMedal ? px2dp(80) : px2dp(105)}}>
            <Text style={[styles.name]} numberOfLines={1}>{item.uname}</Text>
          </View>
          {
            hasMedal ?
            <Image source={{uri: this.getMedal(medal[item.uid][0])}} style={styles.medalavatar}/> : null
          }
        </TouchableOpacity>
        <Text
          style={[styles.contentText, isShortStyle && {marginVertical: 0, marginBottom: px2dp(2)}]}
          numberOfLines={!needShowMoreText || defaultViewMore ? 100 : numberOfLines}
        >
          {item.content}
        </Text>
        {
          needShowMoreText && !defaultViewMore &&
          <TouchableOpacity style={[styles.viewMore, isOneStyle && {bottom: px2dp(2.5)}]} activeOpacity={1} onPress={this.showMore}>
            <WebImage name="answer/qs_more" style={{width: px2dp(20), height: px2dp(20)}}/>
          </TouchableOpacity>
        }
        <View style={[styles.userConetnt, {justifyContent: isOneStyle ? 'flex-end' : 'space-between'}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => { share(item) }} style={styles.smallshare}>
            <WebImage name="answer/new_s_share" style={styles.smallshareicon}/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pointStart, {marginLeft: isOneStyle ? px2dp(22.5) : px2dp(33.5)}]} activeOpacity={1} onPress={this.clickStar}>
            <WebImage name={isLike ? 'answer/star' : 'answer/unstar'} style={styles.icon}/>
            <Text style={[styles.name, {color: isLike ? '#FF6353' : '#666'}]}>{likeTotal > 0 ? likeTotal : ''}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }
  getMedal(medalObj) {
    return filterExts(medalObj.exts, 'iconUrl')
  }
  // 判断文字是否需要查看更多
  layoutText = (e) => {
    if(!this.state.firstLoad) return false
    const {contentHeight} = this.state
    const {height} = e.nativeEvent.layout
    // 默认高度小于实际高度，说明需要显示查看更多按钮
    this.setState({
      needShowMoreText: contentHeight < height,
      firstLoad: false
    })
  }
  clickStar = () => {
    // if(!global.USER_INFO.isLogin) {
    //   return goToLogin()
    // }
    if(this.loading) return false
    if(this.state.isLike) {
      return this.clickUnLike()
    }
    this.clickLike()
  }
  clickLike = async () => {
    try {
      this.loading = true
      const {item, changeAnswerItem: changeAnswerItemProps} = this.props
      const result = await like({aid: item.id, qid: item.qid})
      if(result.code === 'A00000') {
        this.setState({isLike: true, likeTotal: result.data}, () => {
            this.loading = false
        })
        changeAnswerItemProps && changeAnswerItemProps({updateQid: item.qid})
        this.likePingBack('up')
      } else {
        showToast(result.msg)
      }
    } catch(e) {
      this.loading = false
      // TODO 需要找产品定义
      showToast('点赞失败，请稍后重试')
    }
  }
  showMore = () => {
    const {from, readMore, item} = this.props
    if(from === 'List') {
      readMore && readMore({aid: item.id})
    }
    // this.setState({
    //   disableShowMoreButton: true,
    //   needShowMoreText: false
    // })
  }
  likePingBack = (key) => {
    const {from} = this.props
    const pageName = from === 'List' ? 'hole' : 'holex'
    sendClickPingback(`${pageName}`, '', `${pageName}_${key}`)
  }
  clickUnLike = async () => {
    try {
      this.loading = true
      const {item, changeAnswerItem: changeAnswerItemProps} = this.props
      const result = await unLike({
        aid: item.id,
        qid: item.qid
      })
      if(result.code === 'A00000') {
        this.setState({isLike: false, likeTotal: result.data})
        this.likePingBack('down')
        changeAnswerItemProps && changeAnswerItemProps({updateQid: item.qid})
      } else {
        showToast(result.msg)
      }
      this.loading = false
    } catch(e) {
      this.loading = false
      showToast('取消点赞失败，请稍后重试')
    }
  }
}

const styles = StyleSheet.create({
  itemLongContent: {
    width: px2dp(165),
    height: px2dp(175),
    borderRadius: px2dp(5),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: px2dp(15),
    marginVertical: px2dp(5),
    paddingTop: px2dp(15),
    paddingBottom: px2dp(14.5),
    justifyContent: 'space-between',
    // alignItems: 'center'
  },
  first_answer: {
    position: 'absolute',
    width: px2dp(165),
    height: px2dp(160),
    top: 0,
    left: 0
  },
  first_top: {
    position: 'absolute',
    width: px2dp(81),
    height: px2dp(34.5),
    top: 0,
    left: 0
  },
  first_right: {
    position: 'absolute',
    width: px2dp(21),
    height: px2dp(15),
    top: px2dp(4),
    right: px2dp(4)
  },
  hot_bg_right_fire: {
    position: 'absolute',
    width: px2dp(72.5),
    height: px2dp(60.5),
    bottom: 0,
    right: 0
  },
  shortContent: {
    height: px2dp(140),
    paddingTop: px2dp(15),
    paddingHorizontal: px2dp(15),
  },
  contentText: {
    fontSize: px2dp(14),
    color: '#333',
    lineHeight: px2dp(22),
    marginVertical: px2dp(6.5)
  },
  userConetnt: {
    height: px2dp(25),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontSize: px2dp(12),
    color: '#666',
    lineHeight: px2dp(16.5),
  },
  icon: {
    width: px2dp(15),
    height: px2dp(15),
    marginRight: px2dp(2),
  },
  pointStart: {
    marginLeft: px2dp(33.5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemMaxLongContent: {
    width: px2dp(340),
    height: px2dp(100),
    borderRadius: px2dp(5),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: px2dp(15),
    marginVertical: px2dp(5),
    paddingTop: px2dp(16.5),
    paddingBottom: px2dp(20),
    justifyContent: 'space-between',
    // alignItems: 'center'
  },
  user: {
    height: px2dp(29),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    height: px2dp(25),
    width: px2dp(25),
    marginLeft: px2dp(2),
    marginRight: px2dp(5),
    borderRadius: px2dp(12.5),
    overflow: 'hidden'
  },
  medalavatar: {
    height: px2dp(12),
    width: px2dp(13),
    marginLeft: px2dp(3)
  },
  smallshare: {
    height: px2dp(25),
    width: px2dp(25)
  },
  smallshareicon: {
    height: px2dp(15),
    width: px2dp(15),
    margin: px2dp(5)
  },
  viewMore: {
    height: px2dp(20),
    width: '30%',
    left: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: px2dp(26),
    marginLeft: px2dp(15)
  }
})
