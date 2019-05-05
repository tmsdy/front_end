/**
 * 花儿图鉴按钮
 */
import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';
import {Width} from '@iqiyi/rn-utils';
import {TouchableOpacity, ScrollView} from 'react-native';

import WebImage from '../WebImage';

import PageTurn from '../DeepTask/PageTurn';
import ReduxUtil from '../../common/ReduxUtil';
import {GARDEN_ENUM} from '../../constants/IntegralEnum';
import {sendClickPingback} from '../../common/pingback';
import {IllustrationflowerPic} from '../../common/MyFlowerConfig';
import {getObjectValueSafely} from '../../common/util';

export default class IllustrationItem extends PureComponent {
  static defaultProps = {
    containerStyle: {},
  }

  static getFrontBackGroundPic(item) {
    let picName = item ? getObjectValueSafely(IllustrationflowerPic, `${getObjectValueSafely(item, 'channelCode')}.9`) : IllustrationflowerPic.rose[9]
    if(item && item.planting) {
      picName = getObjectValueSafely(IllustrationflowerPic, `${getObjectValueSafely(item, 'channelCode')}.${getObjectValueSafely(item, 'maxStat')}`)
    }
    return picName
  }

  constructor(props) {
    super(props)

    this.refPagetrunref = ReduxUtil.createRef();
  }

  render() {
    const {item} = this.props

    return (
      <View style={[styles.wrapper, this.props.containerStyle]}>
          <PageTurn
            ref={this.refPagetrunref}
            renderFront={() => this._renderFront(item)}
            renderBehind={() => this._renderBehind(item)}
            size={{
              width: 135,
              height: 207
            }}
          />
      </View>
    )
  }

  _renderFront= (item) => {
    const picName = IllustrationItem.getFrontBackGroundPic(item)
    const {channelCode} = item
    if(item.completes || item.planting) {
      return (
        <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => this.turnPage({item})}>
          <WebImage name={picName} style={{width: 135, height: 160}}>
            {item.planting && (
              <View style={styles.frontPlantStatusBox}>
                <Text style={styles.frontPlantStatusText}>培育中</Text>
              </View>
            )}
          </WebImage>
          <View style={styles.frontBottomBox}>
            <Text style={styles.frontFlowerName} numberOfLines={1}>{item.name}</Text>
            {!!item.completes && <Text style={styles.frontPlantNum}>已养成{item.completes}次</Text>}
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity activeOpacity={1} onPress={() => this.turnPage({item})} style={[styles.itemBox, {backgroundColor: '#EFEFEF', flex: 1}]}>
          <View style={{flex: 1}}>
            <WebImage name={`${getObjectValueSafely(IllustrationflowerPic, `${channelCode}.unget`)}`} style={styles.flowerImage}/>
            <View style={[styles.frontBottomBox, {backgroundColor: '#FFC99B'}]}>
              <Text style={styles.frontFlowerName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.frontPlantNum}>未获得</Text>
            </View>
            <WebImage name="ill_question_icon" style={{width: 17, height: 17, position: 'absolute', right: 10, top: 10}}/>
          </View>
        </TouchableOpacity>
      )
    }
  }

  _renderBehind = (item) => {
    const {description, name, fruit, maxDays, notes} = item
    return (
      <WebImage name="ill_back_card" style={styles.backGroundOfBack}>
        <ScrollView style={{flex: 1, paddingBottom: 10}}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.turnPage({item})}>
              <Text style={styles.backTitle}>{name}</Text>
              <Text style={styles.floweLanguage}>{description}</Text>
              <Text style={styles.flowerDate}>花期:<Text style={styles.flowerDateText}>{maxDays}天</Text></Text>
              <Text style={[styles.flowerDate, {marginTop: 4}]}>果实:<Text style={styles.flowerDateText}>{fruit}</Text></Text>
              {(!!notes && !!notes.hbNotice) && <Text style={styles.flowerDateText}>{notes.hbNotice}</Text>}
              <WebImage name="ill_turn_icon" style={styles.turnBtnIcon}/>
          </TouchableOpacity>
        </ScrollView>
      </WebImage>
    )
  }

  // 翻页
  turnPage = ({cb, item} = {}) => {
    const rseat = item.channelCode === GARDEN_ENUM.CHANNEL_CODE.Rose ? 'book_rose' : 'book_money'
    sendClickPingback('flower_page', 'book', rseat)
    this.refPagetrunref.getInstance().then(ref => ref.start(cb))
  }
}

const styles = BaseStyleSheet.create({
  frontPlantStatusBox: {
    width: 40,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  frontPlantStatusText: {
    color: '#ffffff',
    fontSize: 10,
    textAlign: 'center'
  },
  frontBottomBox: {
    height: 47,
    backgroundColor: '#FF9D44',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  frontFlowerName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    marginLeft: 10,
    maxWidth: 60,
    // marginTop: 12
  },
  frontPlantNum: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    marginRight: 10
  },
  backTitle: {
    color: '#ffffff',
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    textAlign: 'center',
    fontSize: 14,
  },
  floweLanguage: {
    fontSize: 11,
    color: '#ffffff',
    marginTop: 11
  },
  flowerDate: {
    fontSize: 12,
    fontWeight: BaseStyleSheet.FontWeight.Medium,
    color: '#ffffff',
    marginTop: 11
  },
  flowerDateText: {
    color: '#ffffff',
    fontSize: 11
  },
  turnBtnIcon: {
    width: 17,
    height: 17,
    position: 'absolute',
    right: 0,
    top: 0
  },
  backGroundOfBack: {
    width: 135,
    height: 207,
    paddingHorizontal: 12,
    paddingTop: 15,
    overflow: 'hidden',
    paddingBottom: 30,
  },
  itemBox: {
    width: 135,
    height: 207,
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  },
  flowerImage: {
    width: 135,
    height: 160
  },
  wrapper: {
    width: 135,
    height: 207,
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  }
})
