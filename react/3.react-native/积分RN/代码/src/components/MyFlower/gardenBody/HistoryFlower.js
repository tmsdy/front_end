/**
 * 历史种成过的花组件
 */
import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {historyInfo, switchHistoryGardenMode, switchWithdrawStatus} from '../../../actions/GardenDetailActions';
import {fetchHistory, fetchIsWithdrawed} from '../../../model/MyFlower'
import {getUserGardenDetail} from '../../../selectors/GardenDetailSelector';
import {GARDEN_ENUM} from '../../../constants/IntegralEnum';
import WebImage from '../../WebImage';
import {sendBlockPingback, sendClickPingback} from '../../../common/pingback';

@connect(
  (state, props) => {
    let {gardenMode, theme, isHistoryGarden, isSwitchingScene} = getUserGardenDetail(state, props);
    return {
      gardenMode,
      theme,
      isHistoryGarden,
      isSwitchingScene
    };
  },
  dispatch => bindActionCreators({
    historyInfo,
    switchHistoryGardenMode,
    switchWithdrawStatus
  }, dispatch),
  null,
  {withRef: true},
)
export default class HistoryFlower extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      historyList: [],
    }
  }

  componentDidMount() {
    const {currUserId} = this.props
    if(parseInt(currUserId)) {
      this.fetchHistoryList()
    }
  }

  componentDidUpdate(prevProps) {
    let {gardenMode, currUserId, isHistoryGarden} = this.props;
    if(gardenMode !== prevProps.gardenMode && !isHistoryGarden) {
      if(parseInt(currUserId)) {
        this.fetchHistoryList()
      }
    }
  }

  render() {
    const {gardenMode, theme, isHistoryGarden} = this.props // 当前是否展示的是历史花
    const {historyList} = this.state
    if(!historyList.length) {
      return null
    }
    let hasHistory = historyList.find(fv => fv.mode !== gardenMode && fv.completes) // 同种类型的花不展示历史种花
    if(!isHistoryGarden && !hasHistory) {
      return null
    }
    const {small, big} = theme.history;
    let historyFlowerTheme = isHistoryGarden ? small : big; // 历史态的小花为未成熟的花(small), 非历史态的小花为成熟的花(big)
    if(isHistoryGarden) {
      historyFlowerTheme = small
    }
    return (
      <TouchableOpacity style={[styles.historyFlower, {left: historyFlowerTheme.left, bottom: historyFlowerTheme.bottom}]} activeOpacity={1} onPress={this._press}>
        <WebImage name={historyFlowerTheme.name} style={{width: historyFlowerTheme.width, height: historyFlowerTheme.height}}/>
      </TouchableOpacity>
    );
  }

  fetchHistoryList = () => {
    fetchHistory().then((list) => {
      if(list.length) {
        this.setState({
          historyList: list
        })
        const moneyFlower = list.find(fv => fv.channelCode === GARDEN_ENUM.CHANNEL_CODE.Money)
        if(moneyFlower) { // 如果用户历史种花里面有金钱花 那么判断一下金钱花是否提现
          fetchIsWithdrawed(GARDEN_ENUM.CHANNEL_CODE.Money).then((data) => {
            this.props.switchWithdrawStatus(data)
          })
        }
        const {gardenMode} = this.props
        if(list.find(fv => fv.channelCode === GARDEN_ENUM.CHANNEL_CODE.Money && fv.completes) && gardenMode === GARDEN_ENUM.MODE.Primary) {
          sendBlockPingback('flower_page', '801001', {
            rseat: 'moneypast_show'
          })
        }
        if(list.find(fv => fv.channelCode === GARDEN_ENUM.CHANNEL_CODE.Rose && fv.completes) && gardenMode === GARDEN_ENUM.MODE.Cash) {
          sendBlockPingback('moneyRN', '801014', {
            rseat: 'rosepast_show'
          })
        }
        this.props.historyInfo(list)
      }
    })
  }
  _press = () => {
    if(this.props.isSwitchingScene) {
      return
    }
    this.props.switchHistoryGardenMode();
    const {gardenMode} = this.props
    if(gardenMode === GARDEN_ENUM.MODE.Primary) {
      sendClickPingback('flower_page', '801002', 'moneypast_click')
    } else {
      sendClickPingback('moneyRN', '801014', 'rosepast_click')
    }
  }
}

const styles = BaseStyleSheet.create({
  historyFlower: {
    position: 'absolute',
    alignSelf: 'center',
  }
});
