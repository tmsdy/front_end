/**
 * 各类弹窗
 */

import React, {Component, PureComponent} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from '@iqiyi/rn-gradient-view';
import {Image, Text, View} from '@iqiyi/rn-ui';
import WebImage from '../components/WebImage';
import ConfirmModal from '../components/ConfirmModal';
import {filterNotes, saveAsyncStorage, unixTimeToFormat} from '../common/util';
import {sendClickPingback} from '../common/pingback'

const ruleSign = [
  {
    day: '1天',
    score: '5'
  },
  {
    day: '2天',
    score: '7'
  },
  {
    day: '3天',
    score: '10'
  },
  {
    day: '4-5天',
    score: '14'
  },
  {
    day: '6-10天',
    score: '16'
  },
  {
    day: '11-15天',
    score: '18'
  },
  {
    day: '16-20天',
    score: '20'
  },
  {
    day: '21-25天',
    score: '23'
  },
  {
    day: '26-30天',
    score: '25'
  },
  {
    day: '30-∞天',
    score: '30'
  },
]

export class GetNewRewardMedal extends Component {
  render() {
    const {
      name,
      modalVisible,
      _hideModal,
      modalData
    } = this.props;
    return (
      <ConfirmModal
        modalVisible={modalVisible}
        iconName={name}
        iconStyle={styles.modalIcon}
        cancelFn={_hideModal}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent1}>
            <Text style={styles.congratulationText}>
              恭喜获得{modalData.channelName}
            </Text>
            <Text style={styles.upLevelText}>
              升级为{modalData.channelName}
            </Text>
            <Text style={styles.newRewardDate}>
              {unixTimeToFormat(modalData.completeTime)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={_hideModal}
            style={styles.shareModalBtnBox}
          >
            <View style={styles.unCompleteModalBtnBox}>
              <Text style={styles.shareModalBtnText}>
                知道了
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ConfirmModal>
    )
  }
}

export class HomePageRuleModal extends PureComponent {
  static defaultProps = {
    mode: 'defalut', // default 默认内容格式，custom：自定义内容
  }

  render() {
    const {homePageRuleVisble, _hideRuleModal, ruleTask} = this.props;
    return (
      <ConfirmModal
        modalVisible={homePageRuleVisble}
        cancelFn={_hideRuleModal}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalContentDaren}>
            <View style={{justifyContent: 'center', position: 'relative', top: -30}}>
              <Text style={{fontSize: 18, color: '#333333', fontWeight: 'bold', textAlign: 'center'}}>规则说明</Text>
            </View>
            <View style={{paddingHorizontal: 23}}>
              <Text style={{marginTop: -20, fontSize: 15, color: '#333333', lineHeight: 20, marginBottom: 22}}>
                {filterNotes(ruleTask)}
              </Text>
            </View>
            <TouchableOpacity style={styles.ruleBtnBox} onPress={_hideRuleModal}>
              <Text style={{color: '#FF7E00', fontSize: 18, textAlign: 'center'}}> 我知道了 </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ConfirmModal>
    );
  }
}

export class HomePageRuleSignModal extends Component {
  render() {
    const {homePageRuleVisble} = this.props;
    return (
      <ConfirmModal modalVisible={homePageRuleVisble}>
        <HomePageRuleSignText {...this.props}/>
      </ConfirmModal>
    );
  }
}

export class HomePageRuleSignText extends Component {
  render() {
    const {
      _hideRuleModal
    } = this.props;
    return (
      <View style={[styles.modalWrapper, {width: 280}]}>
        <View style={styles.modalContentDaren}>
          <View style={{justifyContent: 'center', position: 'relative', top: -30}}>
            <Text style={{fontSize: 18, color: '#333333', fontWeight: 'bold', textAlign: 'center'}}>签到规则</Text>
          </View>
          <View style={{paddingHorizontal: 23}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: 117, marginTop: -20, fontSize: 15, color: '#333333', lineHeight: 20, marginBottom: 22, fontWeight: 'bold', textAlign: 'center'}}>
                连续签到天数
              </Text>
              <Text style={{width: 117, marginTop: -20, fontSize: 15, color: '#333333', lineHeight: 20, marginBottom: 22, fontWeight: 'bold', textAlign: 'center'}}>
                奖励
              </Text>
            </View>
            <ScrollView style={{maxHeight: 130, marginTop: -20}} showsVerticalScrollIndicator={false}>
              <View>
                {ruleSign.map((item, index) => {
                  const bacColor = index % 2 === 0 ? '#FAFAFA' : '#FFFFFF'
                  return (
                    <View key={item.day} style={{height: 25, backgroundColor: bacColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Text style={styles.signRuleRow}> {item.day} </Text>
                      <Text style={styles.signRuleRow}> {`${item.score}积分`} </Text>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
            <Text style={{fontSize: 13, color: '#333333', lineHeight: 20, marginBottom: 22}}>
              1.每日可签到一次；
            </Text>
            <Text style={{marginTop: -20, fontSize: 13, color: '#333333', lineHeight: 20, marginBottom: 22}}>
              2.连续签到天数越多，积分奖励越多；
            </Text>
            <Text style={{marginTop: -20, fontSize: 13, color: '#333333', lineHeight: 20, marginBottom: 22}}>
              3.如果签到中断，需要从头再来。
            </Text>
          </View>
          <TouchableOpacity style={styles.ruleBtnBox} onPress={_hideRuleModal}>
            <Text style={{color: '#FF7E00', fontSize: 18, textAlign: 'center'}}> 我知道了 </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export class MedalPagePersonalDressUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowDress: this.props.dress, // 用户目前选中的装扮
      selectedTask: {
        complete: true
      }, // 选中的任务
      dress: this.props.dress, // 用户当前的装扮
    }
  }

  render() {
    const {
      dressUpVisible,
      hideDressup,
      userIcon,
      dressList,
    } = this.props;
    return (
      dressUpVisible &&
      <ConfirmModal
        modalVisible={dressUpVisible}
        showCloseButton={true}
        cancelFn={hideDressup}
      >
        <View style={styles.dressOuterWrap}>
          <View style={styles.modalDressBox}>
            <View style={styles.dressTitleBox}>
              <View style={styles.line}/>
              <Text style={styles.lineText}>个性装扮</Text>
              <View style={styles.line}/>
            </View>
            <View style={styles.dressListWrap}>
              <ScrollView>
                <View style={styles.dressListBox}>
                  {!!dressList.length && dressList.map((item, index) => {
                    return (
                      <TouchableOpacity key={item.channelCode} style={styles.dressListItemBox} onPress={() => this.clickToChange(item.channelCode, index)}>
                        <View style={styles.itemTopSection}>
                          <WebImage name="circle_no_white" style={{width: 49, height: 49, marginTop: 15}}>
                            <Image source={{uri: userIcon}} style={styles.usericonPic}/>
                          </WebImage>
                          {this.state.dress === item.channelCode && <WebImage name="dressup_use" style={styles.itemUseStatus}/>}
                          {item.channelCode !== 'default' && <WebImage name={item.channelCode === 'default' ? '' : `avatar_${item.channelCode}`} style={styles.touXiang}/>}
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                          <Text numberOfLines={1} style={{fontSize: 12, color: '#999999', marginTop: 12, maxWidth: 65}}>
                            {item.channelCode === 'default' ? '默认头像框' : `${item.channelName}头像框`}
                          </Text>
                          {item.channelCode !== 'default' && !item.complete && <WebImage name="dressup_lock" style={{width: 8, height: 10, marginBottom: 2}}/>}
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </ScrollView>
            </View>
            {(this.state.selectedTask.channelCode === 'default' || this.state.selectedTask.complete) ?
              <TouchableOpacity onPress={this.clickToSaveDress}>
                <WebImage name="dressup_modal_btn" style={styles.dressBtnBox}>
                  <Text style={styles.dressBtnText}>立即佩戴</Text>
                </WebImage>
              </TouchableOpacity>
              :
              <View style={{width: 300, height: 42, backgroundColor: '#CCCCCC', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}>
                <Text style={styles.dressBtnText}>解锁后佩戴</Text>
              </View>}
          </View>
          <View style={styles.dreeUpTopBox}>
            <WebImage name="usericon_circle" style={styles.dressIconCircle}>
              <Image source={{uri: userIcon}} style={styles.dressUserIcon}/>
            </WebImage>
            {this.state.nowDress !== 'default' && <WebImage name={`avatar_${this.state.nowDress}`} style={{width: 92, height: 49, position: 'absolute', top: 16, left: 18}}/>}
            <Text style={styles.dressText}>当前装扮</Text>
          </View>
        </View>
      </ConfirmModal>
    );
  }

  clickToChange = (channelCode, index) => {
    const pingbackArray = ['mrhead', 'dogyearhead', 'ballerhead']
    this.setState({
      nowDress: channelCode,
      selectedTask: this.props.dressList[index]
    })
    sendClickPingback('medalH5', 400200, pingbackArray[index]);

  }
  clickToSaveDress = () => {
    this.setState({
      dress: this.state.nowDress
    }, () => {
      sendClickPingback('medalH5', 400200, 'wear');
      const keyValuePairs = [[`dress${global.USER_INFO.userId}`, this.state.dress]];
      saveAsyncStorage(keyValuePairs)
      this.props.saveDressAction(this.state.nowDress)
      this.props.hideDressup()
    })
  }

}

export class LeaderBoardRuleModal extends Component {
  render() {
    const {
      instructionVisible,
      _hideRuleModal,
    } = this.props;
    return (
      <ConfirmModal
        modalVisible={instructionVisible}
      >
        <View style={[styles.modalWrapper, {backgroundColor: 'transparent', borderRadius: 15}]}>
          <WebImage name="911_phbtk" style={{width: 270, height: 395}}>
            <TouchableOpacity style={{position: 'absolute', bottom: 25, left: 75}} onPress={_hideRuleModal}>
              <WebImage name="btn_4words" style={{width: 120, height: 40, justifyContent: 'center'}}>
                <Text style={{color: '#FF3E54', fontSize: 16, textAlign: 'center'}}>我知道了</Text>
              </WebImage>
            </TouchableOpacity>
          </WebImage>
        </View>
      </ConfirmModal>
    )
  }
}

export class GetVipCard extends Component {
  render() {
    const {
      getVipCardVisible,
      hideVipModal,
      goRecord,
      rank
    } = this.props;
    const today = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    const month = today.getMonth() + 1; // 此方法获得的月份是从0---11，所以要加1才是当前月份
    const day = today.getDate(); // 获得当前日期
    return (
      <ConfirmModal
        modalVisible={getVipCardVisible}
        iconName="vip_card"
        iconStyle={styles.vipIcon}
        showCloseButton={true}
        cancelFn={hideVipModal}
      >
        <View style={[styles.modalWrapper, styles.getVipBox]}>
          <Text style={styles.vipTitile}>恭喜获得VIP</Text>
          <View style={{width: 222, marginTop: 10}}>
            <Text style={styles.vipInfoContent}>
              你在{month}月{day}日乐园排行榜中排名{rank}获得一张爱奇艺VIP天卡请至“兑换记录”中查看并激活
            </Text>
          </View>
          <TouchableOpacity onPress={goRecord}>
            <LinearGradient
              start={{x: 0, y: 1}}
              end={{x: 1, y: 1}}
              colors={['#FF2C97', '#FF724D']}
              style={styles.linearBtn}
            >
              <Text style={styles.goToOrdeListBtn}>去查看</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ConfirmModal>
    )
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column'
  },
  modalWrapper: {
    width: 270,
    padding: 0,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    alignItems: 'center'
  },
  modalContent1: {
    width: 270,
    paddingTop: 80,
    alignItems: 'center'
  },
  modalContentDaren: {
    paddingTop: 50,
  },
  modalIcon: {
    position: 'absolute',
    width: 160,
    height: 160,
    top: -85,
    left: 56.5,
  },
  modalIconMoRen: {
    position: 'absolute',
    width: 101,
    height: 116,
    top: -50,
    left: 84.5,
  },
  shareModalTitle: {
    color: '#FF8E00',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 220
  },
  shareModalDescription: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  shareModalDate: {
    color: '#999999',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 18
  },
  shareModalBtnBox: {
    width: 270,
    height: 42,
    backgroundColor: '#FF8E00',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
    marginBottom: -1
  },
  shareModalBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  unCompleteModalBtnBox: {
    width: 270,
    height: 42,
    backgroundColor: '#FF8E00',
    justifyContent: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  congratulationText: {
    color: '#FF8E00',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 10
  },
  upLevelText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8
  },
  newRewardDate: {
    color: '#999999',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 18
  },
  completeChannelName: {
    color: '#666666',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold'
  },
  completeDescription: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 20
  },
  unlockText: {
    color: '#999999',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    marginBottom: 18
  },
  ruleBtnBox: {
    justifyContent: 'center',
    width: 270,
    height: 45,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2'
  },
  modalDressBox: {
    width: 300,
    maxHeight: 380,
    minHeight: 254,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 64.25,
  },
  dreeUpTopBox: {
    width: 128.5,
    height: 128.5,
    borderRadius: 64.25,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 0,
    left: 85.75
  },
  dressIconCircle: {
    width: 67.1,
    height: 67.1,
    position: 'absolute',
    top: 30.2,
    left: 30.2
  },
  dressUserIcon: {
    width: 59,
    height: 59,
    borderRadius: 29.5,
    marginTop: 4,
    marginLeft: 4
  },
  dressText: {
    color: '#666666',
    fontSize: 13,
    position: 'relative',
    top: 104,
    textAlign: 'center'
  },
  dressTitleBox: {
    width: 300,
    flexDirection: 'row',
    marginTop: 74,
    justifyContent: 'center',
    alignItems: 'center'
  },
  line: {
    width: 93,
    borderTopColor: '#FFA134',
    borderTopWidth: 1
  },
  lineText: {
    color: '#FE9428',
    fontSize: 12,
    marginHorizontal: 14
  },
  dressBtnText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    lineHeight: 42
  },
  dressBtnBox: {
    width: 300,
    height: 42,
  },
  dressListWrap: {
    flexGrow: 1,
    marginTop: 25,
    width: 300,
    minHeight: 100.5,
    maxHeight: 250,
  },
  dressListBox: {
    width: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  dressListItemBox: {
    alignItems: 'center',
    paddingHorizontal: 13.25,
    marginBottom: 25
  },
  itemTopSection: {
    width: 72.5,
    height: 63,
    justifyContent: 'center',
    alignItems: 'center'
  },
  usericonPic: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginTop: 1.25,
    marginLeft: 1.25
  },
  itemUseStatus: {
    width: 43,
    height: 16,
    position: 'absolute',
    bottom: 0,
    left: 15
  },
  touXiang: {
    width: 70,
    height: 39.5,
    position: 'absolute',
    top: 0,
    marginLeft: 1.5,
    marginTop: 1.5
  },
  dressOuterWrap: {
    width: 300,
    backgroundColor: 'transparent',
    maxHeight: 464,
    minHeight: 318,
    borderRadius: 10,
    alignItems: 'center'
  },
  signRuleRow: {
    lineHeight: 25,
    height: 25,
    width: 117,
    fontSize: 13,
    color: '#333333',
    textAlign: 'center'
  },
  vipIcon: {
    width: 175,
    height: 90,
    position: 'absolute',
    top: -50
  },
  linearBtn: {
    width: 120,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    marginTop: 15
  },
  goToOrdeListBtn: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center'
  },
  getVipBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: 270,
    height: 210
  },
  vipTitile: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    marginTop: 40
  },
  vipInfoContent: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20
  },
  levelRuleItemBox: {
    width: 230,
    flexDirection: 'row',
    marginBottom: 7,
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
});
