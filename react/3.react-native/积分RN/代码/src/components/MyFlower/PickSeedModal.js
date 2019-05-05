/**
 * Created by linnyli.
 * @date 2019-3-13
 * @description 选种子弹窗
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ScrollView, TouchableOpacity} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'

import {GARDEN_ENUM, STORAGE_ENUM} from '../../constants/IntegralEnum';

import WebImage from '../WebImage';
import {getStorage, setStorage} from '../../common/util';
import {fetchFlowerSeeds} from '../../model/MyFlower';
import {updateFlowerSeeds} from '../../actions/GardenDetailActions';
import {sendBlockPingback, sendClickPingback} from '../../common/pingback';

const SEED_PIC = {
  rose: 'flower/select_seed_primary',
  genius: 'flower/select_seed_talent'
}


@connect(
  ({gardenDetail}) => {
    const {seeds} = gardenDetail
    return {
      seeds,
    };
  },
  dispatch => bindActionCreators({
    updateFlowerSeeds
  }, dispatch),
  null,
  {withRef: true},
)
export default class PickSeedModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNewIcon: false
    }
  }

  componentDidMount() {
    this.showNewIcon()
    this.fetchSeedsData()
    sendBlockPingback('flower_page', 'choose_pop')
  }

  render() {
    const {seeds} = this.props
    if(!seeds || !seeds.length) {
      return null
    }
    return (
      <View style={styles.container}>
        <WebImage name="pick_seed" style={styles.boxTitle}/>
        <View style={styles.boxWrapper}>
          <ScrollView
            style={{height: 229}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {!!seeds.length && (
              seeds.map(this.renderSeedItem)
            )}
          </ScrollView>
        </View>
      </View>
    )
  }

  renderSeedItem = (item) => {
    const {name, channelCode, poem2, hasSeed} = item
    const {showNewIcon} = this.state
    const isShowNew = channelCode === GARDEN_ENUM.CHANNEL_CODE.Genius
    return (
      <View key={channelCode} style={styles.itemBox}>
        <WebImage name={SEED_PIC[channelCode] || SEED_PIC.rose} style={styles.titlePic}/>
        <View style={styles.title}>
          <Text style={styles.flowerName}>{name}</Text>
          {showNewIcon && isShowNew &&
            <View style={styles.newIcon}>
              <Text style={styles.newText}>NEW</Text>
            </View>
          }
        </View>
        <Text style={styles.flowerLanguage}>{poem2}</Text>
        {
          hasSeed ?
          <TouchableOpacity activeOpacity={1} style={styles.selectBtn} onPress={() => this.goToPlant(item)}>
            <Text style={styles.btnText}>选我</Text>
          </TouchableOpacity> :
          <View style={[styles.selectBtn, styles.disableSeed]}>
            <Text style={styles.btnText}>已抢完</Text>
          </View>
        }
      </View>
    )
  }

  goToPlant = (item) => {
    const {channelCode} = item
    sendClickPingback('flower_page', 'choose_pop', `flower_${channelCode}`)
    this.props.hideConfirmModal().then(() => this.props.replant({channelCode}))
  }

  showNewIcon = () => {
    const key = STORAGE_ENUM.TALENT_NEW_ICON
    getStorage(key).then((data) => {
      if(!data) {
        this.setState({
          showNewIcon: true
        })
        setStorage(key, true)
      }
    })
  }

  fetchSeedsData = () => {
    fetchFlowerSeeds().then((data) => {
      if(data.length) {
        this.props.updateFlowerSeeds(data)
      }
    })
  }

}

const styles = BaseStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  boxTitle: {
    width: 242,
    height: 70,
    alignSelf: 'center',
    marginBottom: 30
  },
  boxWrapper: {
    height: 229,
    paddingLeft: 22
  },
  itemBox: {
    width: 158,
    height: 229,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginRight: 15,
    alignItems: 'center'
  },
  titlePic: {
    width: 110,
    height: 110,
    marginTop: 11
  },
  flowerName: {
    fontSize: 14,
    color: '#333333',
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    lineHeight: 20,
    marginTop: 7
  },
  flowerLanguage: {
    color: '#2A2A2A',
    fontSize: 12,
    lineHeight: 18
  },
  selectBtn: {
    width: 89,
    height: 35,
    backgroundColor: '#FF8A1F',
    borderRadius: 35,
    justifyContent: 'center',
    marginTop: 8
  },
  btnText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    alignSelf: 'center'
  },
  newIcon: {
    backgroundColor: '#FF4832',
    width: 23,
    height: 10,
    justifyContent: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    marginTop: -5
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  newText: {
    color: '#FFFFFF',
    fontSize: 7,
    textAlign: 'center'
  },
  disableSeed: {
    backgroundColor: '#e2e2e2'
  }
})
