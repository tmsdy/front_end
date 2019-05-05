/**
 * 养花详情页好友列表
 */
import React, {PureComponent} from 'react';
import {TouchableOpacity, FlatList} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {View, Text, Image} from '@iqiyi/rn-ui';
import {Width, isLikeX} from '@iqiyi/rn-utils';

import WebImage from '../WebImage';
import CollectProcessModal from './CollectGainModals';
import {concatFriendsList, updateFriendInfo, clearFriendsList, switchToFriendGardenMode, updateReviveNum, updateSpeederNum} from '../../actions/GardenDetailActions';
import {GARDEN_ENUM} from '../../constants/IntegralEnum';
import {getCDNUrl} from '../../constants/configs';
import {goToLogin, getObjectValueSafely} from '../../common/util';
import {shareToFriends} from '../utils';
import {sendClickPingback} from '../../common/pingback';
import {fetchFriendsList, askToAddFriends} from '../../model/MyFlower';
import PingbackConfig from '../../common/PingbackConfig';
import MyFlowerConfig from '../../common/MyFlowerConfig';


// 好友列表高度
const BOTTOM_HEIGHT = isLikeX() ? 130 : 93

const SHARE_TO_FRIENDS_TEXT = [
  {
    leftIcon: 'bulliten_bee',
    textPic: 'invite_bee_text'
  },
  {
    leftIcon: 'bulliten_fertilizer',
    textPic: 'invite_fertilizer_text'
  },
  {
    leftIcon: 'bulliten_water',
    textPic: 'invite_water_text'
  },
]

@connect(
  ({gardenDetail}) => {
    let {isMasterMode, masterGardenMode, friendGardenMode, isHistoryGardenMode, illustrationSelected} = gardenDetail,
    gardenMode = isMasterMode ? masterGardenMode : friendGardenMode,
    {theme} = MyFlowerConfig[gardenMode]
    return {
      theme,
      isMasterMode,
      masterUserId: gardenDetail.masterUserId,
      friendUserId: gardenDetail.friendUserId,
      friendsList: gardenDetail.friendsList,
      masterFlowerInfo: gardenDetail.masterGardenInfo.flowerInfo,
      channelCode: gardenDetail.masterGardenInfo.channelCode,
      reviveNum: gardenDetail.reviveNum,
      speederNum: gardenDetail.speederNum,
      gardenMode,
      isHistoryGardenMode,
      illustrationSelected
    }
  },
  dispatch => bindActionCreators({
    concatFriendsList,
    clearFriendsList,
    updateFriendInfo,
    switchToFriendGardenMode,
    updateReviveNum,
    updateSpeederNum,
  }, dispatch),
  null,
  {withRef: true},
)
export default class FriendsList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      shadowVisible: false,
      hasRequestDone: false, // 是否完成过请求
    };

   this.requestLock = false;
   this.pageSize = 20; // 每页获取的数量
   this.pageNo = 0; // 当前页号
   this.totalFriendCount = 0; // 总的好友数
  }

  componentDidMount() {
    // 登录态才需要获取好友列表
    if(this.props.masterUserId) {
      this.addSharedUserToFriendIfNeeded().then(({newReviver, newCollection, newSpeeder}) => {
        if(newReviver || newCollection || newSpeeder) {
          let collectProcessModalProps = {
            cards: {},
            hide: this.props.hideConfirmModal
          }

          if(newReviver) {
            collectProcessModalProps.cards.fertilizer = {count: 1}
            collectProcessModalProps.hide = () => {
              return this.props.hideConfirmModal().then(() => {
                if(newSpeeder) {
                  this.props.updateSpeederNum(this.props.speederNum + 1)
                }
                this.props.updateReviveNum(this.props.reviveNum + 1)
              })
            }
          }

          if(newCollection) {
            collectProcessModalProps.cards.collection = {count: 1}
            collectProcessModalProps.channelCode = GARDEN_ENUM.CHANNEL_CODE.Money
            collectProcessModalProps.show = this.props.showConfirmModal
          }

          if(newSpeeder) {
            collectProcessModalProps.cards.speeder = {count: 1}
            if(!newReviver) {
              collectProcessModalProps.hide = () => {
                return this.props.hideConfirmModal().then(() => {
                  this.props.updateSpeederNum(this.props.speederNum + 1)
                })
              }
            }
          }

          this.props.showConfirmModal({
            content: <CollectProcessModal {...collectProcessModalProps}/>,
            showCloseButton: false,
          });
        }
      }).finally(() => this.fetchFriendsList(false));
    }
  }

  render() {
    let {friendsList, masterUserId, isHistoryGardenMode, illustrationSelected} = this.props,
      {hasRequestDone} = this.state;
    if(isHistoryGardenMode) {
      return (
        <View style={[styles.container, styles.illustration, {backgroundColor: this.props.theme.friendList.backColor}]}>
          <View style={styles.illustrationTextBox}>
            <Text style={styles.flowrLanguage}>花语：</Text>
            <Text style={styles.flowrLanguageLong}>{illustrationSelected.poem}</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={[styles.container, {backgroundColor: this.props.theme.friendList.backColor}]}>
        {(!masterUserId || hasRequestDone) && (friendsList.length > 0 ? this.renderFriendsList() : this.renderInviteFriends())}
      </View>
    )
  }

  renderFriendsList = () => {
    const {friendsList} = this.props
    const {shadowVisible} = this.state
    return (
      <View style={styles.listWrapper}>
        {!!shadowVisible && <WebImage name="friendslist_shadow" style={styles.shadow}/>}
        <TouchableOpacity style={styles.inviteBtn} activeOpacity={1} onPress={() => this.onPressInviteBtn()}>
          <View style={[styles.inviteWrap, {backgroundColor: this.props.theme.friendList.backColor}]}>
            <WebImage name="friends_invite" style={styles.plusPic} />
            <Text style={styles.inviteText}>邀请</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.friendsListWrap}>
          <FlatList
            style={{flex: 1, height: BOTTOM_HEIGHT}}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={friendsList}
            renderItem={this.renderFriendsItem}
            onScroll={this.onScroll}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
          />
        </View>
      </View>
    )
  };

  renderInviteFriends = () => {
    const index = Math.floor(Math.random() * SHARE_TO_FRIENDS_TEXT.length)
    const selected = SHARE_TO_FRIENDS_TEXT[index]
    return (
      <View style={styles.inviteBox}>
        <WebImage name={selected.leftIcon} style={styles.bullitenPic}/>
        <WebImage name={selected.textPic} style={styles.inviteTextPic}/>
        <TouchableOpacity onPress={() => this.onPressInviteBtn()}>
          <WebImage name={this.props.masterUserId ? 'invite_button' : 'login_button'} style={styles.inviteFriendsBtn}/>
        </TouchableOpacity>
      </View>
    )
  };

  renderFriendsItem = ({item, index}) => {
    const {friendUserId, isMasterMode} = this.props,
      isCurrentUser = !isMasterMode && friendUserId === item.userId,
      tagName = this.getTagName(item);

    return (
      <TouchableOpacity style={styles.friendItem} key={item.userId} onPress={() => this.onItemPress(item, index)} activeOpacity={1}>
        <View style={styles.userInfoBox}>
          <Image source={{uri: item.avatar || getCDNUrl('default_icon')}} style={styles.userIcon}/>
          {isCurrentUser && <View style={styles.selectedStatus}/>}
          <WebImage name={tagName} style={styles.tagIcon}/>
        </View>
        <Text style={[styles.userName, isCurrentUser && styles.userNameActive]} numberOfLines={1}>{item.nickname}</Text>
      </TouchableOpacity>
    )
  };

  fetchFriendsList = (isAppend) => {
    this.pageNo = isAppend ? this.pageNo + 1 : 0;
    if(this.requestLock || (this.props.friendsList.length >= this.totalFriendCount && this.pageNo > 0)) {
      return;
    }
    this.requestLock = true;

    const param = {
      pageSize: this.pageSize,
      page: this.pageNo,
    };
    fetchFriendsList(param).then(({contents, total}) => {
      if(contents && contents.length) {
        if(!isAppend) {
          this.props.clearFriendsList();
        }
        this.props.concatFriendsList(contents);
        this.totalFriendCount = total;
        this.requestLock = false;
      }
    }).finally(() => {
      this.setState({hasRequestDone: true});
    });
  }

  addSharedUserToFriendIfNeeded = () => { // 添加好友成功之后更新好友列表
    let {screenProps, masterUserId} = this.props;
    if(!screenProps || !screenProps.sharerUid) {
      return Promise.resolve();
    }

    const {sharerUid, shareName, shareAvatar} = this.props.screenProps;
    return askToAddFriends({
      userId: masterUserId,
      avatar: global.USER_INFO.userIcon,
      nickname: global.USER_INFO.userName,
      friendId: sharerUid,
      friendAvatar: shareAvatar,
      friendNickname: shareName,
    });
  };

  onEndReached = () => {
    this.fetchFriendsList(true)
  }

  onPressInviteBtn = () => {
    const {gardenMode} = this.props
    const {page, block, rseat} = PingbackConfig[gardenMode].friendList.inviteBtn
    sendClickPingback(page, block, rseat)
    const masterFlowerInfo = getObjectValueSafely(this.props, 'masterFlowerInfo')
    const masterUserId = getObjectValueSafely(this.props, 'masterUserId')
    if(masterUserId) {
      if(masterFlowerInfo.type === 'faded') {
        const keyName = this.props.channelCode === GARDEN_ENUM.CHANNEL_CODE.Money ? 'cashRevive' : 'iDead'
        shareToFriends(keyName)
      } else {
        shareToFriends('giveSeed')
      }
    } else {
      goToLogin()
    }
  }

  getTagName = (item) => {
    const {appeared, wateredToday, statusCode} = item;
    if(item.new) {
      return 'tag_new'
    } else if(statusCode === -1) {
      return 'tag_leaf'
    } else if(!wateredToday) {
      return 'tag_drop'
    } else if(appeared) {
      return 'tag_bee'
    }
  }

  onItemPress = (item, index) => {
    if(!this.props.isMasterMode && this.props.friendUserId === item.userId) {
      return
    }
    sendClickPingback('flower_page', '', `friend_${index + 1}`)
    const friendGardenMode = GARDEN_ENUM.CHANNELCODE_MODE[getObjectValueSafely(item, 'channelCode', 'rose')]
    this.props.updateFriendInfo(item.userId, {new: false});
    this.props.switchToFriendGardenMode(item.userId, friendGardenMode);
  }

  onScroll = ({nativeEvent}) => {
    let {x} = nativeEvent.contentOffset;
    this.setState({
      shadowVisible: x > 0,
    })
  }
}

const styles = BaseStyleSheet.create({
  container: {
    width: '100%',
    height: BOTTOM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    iosx: {
      marginTop: 15,
    },
    justifyContent: 'center'
  },
  shadow: {
    width: 20,
    height: 65,
    position: 'absolute',
    top: 13,
    left: 55
  },
  inviteBtn: {
    width: 65,
    height: BOTTOM_HEIGHT,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
  },
  plusPic: {
    width: 45,
    height: 45,
    alignSelf: 'center',
    marginBottom: 5
  },
  inviteText: {
    color: '#814418',
    fontSize: 11,
    lineHeight: 15,
    width: 65,
    textAlign: 'center'
  },
  friendsListWrap: {
    width: Width - 65,
    height: BOTTOM_HEIGHT,
    position: 'absolute',
    left: 65,
  },
  friendItem: {
    width: 65,
    height: BOTTOM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  userInfoBox: {
    width: 45,
    height: 45,
    justifyContent: 'center'
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center'
  },
  selectedStatus: {
    width: 45,
    height: 45,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 45,
    justifyContent: 'center',
    position: 'absolute',
    top: 0
  },
  tagIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 0,
    right: 0
  },
  userName: {
    color: '#814418',
    fontSize: 11,
    marginTop: 5
  },
  userNameActive: {
    color: '#FFF',
  },
  inviteBox: {
    width: Width,
    height: BOTTOM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 11
  },
  bullitenPic: {
    width: 55,
    height: 55
  },
  inviteTextPic: {
    width: 192,
    height: 44,
  },
  inviteFriendsBtn: {
    width: 84,
    height: 31
  },
  inviteWrap: {
    width: 65,
    height: BOTTOM_HEIGHT,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
  },
  listWrapper: {
    width: Width,
    height: BOTTOM_HEIGHT
  },
  illustration: {
    paddingHorizontal: 20,
  },
  illustrationTextBox: {
    flexDirection: 'row',
    width: Width - 40,
    alignSelf: 'center'
  },
  flowrLanguage: {
    color: '#814418',
    fontSize: 12
  },
  flowrLanguageLong: {
    color: '#A46436',
    flex: 1,
    fontSize: 12
  }
})
