/**
 * Created by liuzhimeng.
 * @date 2019-01-04
 * @description 金钱花集宝卡弹窗
 */
import React, {PureComponent} from 'react'
import {TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {Text, View} from '@iqiyi/rn-ui'

import {GARDEN_ENUM} from '../../constants/IntegralEnum'
import WebImage from '../WebImage'
import CommonButton from '../CommonButton'
import {fetchConditionStatus} from '../../model/MyFlower'
import {shareToFriends} from '../utils'
// import {sendClickPingback} from '../../common/pingback'

import HelpModal from './HelpModal.cash'
import ReplaceModal from './gardenBody/ReplaceModal'
import {updateCollectNum} from '../../actions/GardenDetailActions';
import {sendClickPingback, sendBlockPingback} from '../../common/pingback';

const COLLECTION_CARD_IMAGE_MAP = [
  'flower/flower_cash_collect_gold_pure',
  'flower/flower_cash_collect_money_pure',
  'flower/flower_cash_collect_flower_pure',
]

export default class CollectModal extends PureComponent {
  static propTypes = {
    channelCode: PropTypes.string,
    show: PropTypes.func,
    hide: PropTypes.func,
  }

  static defaultProps = {
    channelCode: GARDEN_ENUM.CHANNEL_CODE.Money, // Todo: 由于目前只合成金钱花，且没有提供获取channelCode的接口，因此暂时写死
  }

  constructor(props) {
    super(props)
    this.state = {
      isMainbody: true,
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isMainbody
          ? (
            <CollectMainModal
              channelCode={this.props.channelCode}
              show={this.props.show}
              hide={this.props.hide}
              goHelp={() => this.goAnother(false)}
            />
          )
          : <HelpModal showBack={true} goBack={() => this.goAnother(true)}/>
        }
      </React.Fragment>
    )
  }

  goAnother = (isMainbody) => {
    this.setState({isMainbody})
  }
}

@connect(
  ({gardenDetail}) => {
    return {
      collectNum: gardenDetail.collectNum
    }
  },
  dispatch => bindActionCreators({
    updateCollectNum,
  }, dispatch),
  null,
  {withRef: true},
)
export class CollectMainModal extends PureComponent {
  static propTypes = {
    channelCode: PropTypes.string,
    goHelp: PropTypes.func,
    show: PropTypes.func,
    hide: PropTypes.func,
  }

  componentDidMount() {
    if(!this.props.collectNum) {
      this._fetchConditionStatus()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.collectNum === 3 && (
          <WebImage name="flower/flower_cash_collect_modal_decoration" style={styles.collectComplete}/>
        )}
        <QuestionIcon style={styles.mainQuestion} onPress={() => this.props.goHelp()}/>
        <ModalCardBg
          withQuestionIcon={false}
          HeaderComponent={(
            <View style={styles.boxTitleWrapper}>
              <WebImage name="flower/flower_box_title_decoration" style={styles.boxTitleDecoration}/>
              <WebImage name="flower/flower_cash_collect_modal_title" style={styles.boxTitle}/>
            </View>
          )}
        >
          <View style={styles.collectionWrapper}>
            {this._formatList(this.props.collectNum).map(({id, collectNum, image}) => (
              <WebImage
                key={id}
                style={styles.collectionImage}
                name={collectNum ? image : 'flower/flower_cash_collect_modal_not_get'}
              />
            ))}
          </View>
          <Text style={styles.collectTip}>{this._getCollectTip()}</Text>
          <View style={styles.line}/>
          <Text style={styles.collectionTitle}>集宝卡规则</Text>
          <Text style={styles.collectionDesc}>
            {this.props.collectNum === 3
              ? (
                <React.Fragment>
                  你已集齐<Text style={styles.textActive}>3</Text>张卡片，获得金钱花种植资格！养成后最高可得
                  <Text style={styles.textActive}>2019</Text>元大奖！请在<Text style={styles.textActive}>2019.3.31</Text>
                  前种下，否则失效哦~
                </React.Fragment>
              )
              : (
                <React.Fragment>
                  通过邀请好友、捕捉蜜蜂，集齐<Text style={styles.textActive}>3</Text>
                  张卡片，即可种植金钱花啦！养成金钱花最高可获<Text style={styles.textActive}>2019</Text>元大奖哦！卡片有限，先集先得！
                  集卡期限：<Text style={styles.textActive}>2019.1.28</Text>至<Text style={styles.textActive}>2019.2.28</Text>
                </React.Fragment>
              )
            }
          </Text>
          <View style={styles.buttonWrapper}>
            <CommonButton
              mode="pure"
              text={this._getButtonText()}
              onPress={this._onPress}
              containerStyle={{width: 150}}
              buttonWrapperStyle={{backgroundColor: '#FFA429'}}
            />
          </View>
        </ModalCardBg>
      </View>
    )
  }

  _formatList = (collectNum) => {
    const list = []
    for(let i = 0; i < 3; i++) {
      list.push({
        id: `${i}`,
        collectNum: i < collectNum,
        image: COLLECTION_CARD_IMAGE_MAP[i],
      })
    }
    return list
  }

  _getCollectTip = () => {
    const {collectNum} = this.props
    if(collectNum === 0) return '当前0张，邀请好友赶紧获得'
    if(collectNum === 3) return '恭喜你已获得种植资格！'
    return `已获${collectNum}张`
  }

  _getButtonText = () => {
    return this.props.collectNum === 3 ? '立即种下' : '邀请好友'
  }

  _fetchConditionStatus = async () => {
    if(this.props.channelCode) {
      const {complete = 0} = await fetchConditionStatus(this.props.channelCode)
      if(complete < 3) {
        sendBlockPingback('flower_page', '801001', {
          rseat: 'moneycollect'
        })
      }
      this.props.updateCollectNum(complete)
    }
  }

  _onPress = () => {
    this.props.hide()
    if(this.props.collectNum === 3) {
      this.props.show({
        content: <ReplaceModal hide={this.props.hide}/>,
      })
    } else {
      sendClickPingback('flower_page', '801001', 'moneycollectshare')
      shareToFriends('cashSuiPianJiHuo')
    }
  }
}

// 卡片背景
export function ModalCardBg({children, style, withQuestionIcon, goHelp, HeaderComponent}) {
  return (
    <WebImage name="flower/flower_box_cash" style={[styles.flowerBox, style]}>
      {HeaderComponent}
      {withQuestionIcon && <QuestionIcon style={styles.question} onPress={goHelp}/>}
      {children}
    </WebImage>
  )
}

ModalCardBg.propTypes = {
  HeaderComponent: PropTypes.node,
  withQuestionIcon: PropTypes.bool,
}
ModalCardBg.defaultProps = {
  HeaderComponent: '',
  withQuestionIcon: true,
}

// 问号按钮
export function QuestionIcon({style, onPress}) {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={[styles.questionIcon, style]}>
      <WebImage name="flower/flower_help_modal_question_entrance" style={styles.questionIcon}/>
    </TouchableOpacity>
  )
}

const CONTAINER_WIDTH = 300
const styles = BaseStyleSheet.create({
  // ModalCardBg
  flowerBox: {
    width: CONTAINER_WIDTH,
    height: 460,
    alignItems: 'center',
  },
  question: {
    position: 'absolute',
    right: 23,
    top: 23,
  },

  // QuestionIcon
  questionIcon: {
    width: 20,
    height: 20,
  },

  // CollectMainModal
  container: {
    height: 460,
    paddingHorizontal: 17.5,
  },
  mainQuestion: {
    position: 'absolute',
    right: 23 + 17.5,
    top: 23,
    zIndex: 3,
  },

  collectComplete: {
    position: 'absolute',
    top: 30,
    left: 11,
    zIndex: 2,
    width: 324,
    height: 193,
  },

  boxTitleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: CONTAINER_WIDTH,
    height: 30,
    marginTop: 30,
    marginBottom: 22.5,
  },
  boxTitleDecoration: {
    position: 'absolute',
    left: (CONTAINER_WIDTH - 180) / 2,
    top: (30 - 4) / 2,
    width: 180,
    height: 4,
  },
  boxTitle: {
    width: 124,
    height: 30,
  },

  collectionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 89 * 3,
    marginBottom: 5,
  },
  collectionBg: {
    width: 75,
    height: 105,
    borderRadius: 10,
  },
  collectionImage: {
    width: 89,
    height: 123.5,
  },

  collectTip: {
    width: '100%',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    color: '#FF7D6F',
  },
  line: {
    width: 245,
    height: 0.5,
    marginBottom: 15,
    backgroundColor: '#F6DFCA',
  },
  collectionTitle: {
    lineHeight: 22.5,
    marginBottom: 3,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DE773D',
  },
  collectionDesc: {
    width: 232.5,
    lineHeight: 20,
    marginBottom: 25,
    color: '#DC9065',
    fontSize: 14,
  },
  textActive: {
    color: '#FF4D29',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    width: '100%',
    alignItems: 'center',
  }
})
