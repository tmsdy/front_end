/**
 * 花儿图鉴弹窗（废弃，改用 IllustrationModal）
 */
import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui';
import {Width, Height} from '@iqiyi/rn-utils';
import {
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Animated,
  Easing
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {switchHistoryGardenMode, setIllustration, switchShowReplantBox} from '../../actions/GardenDetailActions';
import ReduxUtil from '../../common/ReduxUtil';
import {fetchFlowerIllustration} from '../../model/MyFlower';
import {GARDEN_ENUM} from '../../constants/IntegralEnum';
import WebImage from '../WebImage';

import IllustrationItem from './IllustrationItem'
import {sendClickPingback, sendBlockPingback} from '../../common/pingback';

const PORTRAIT_HEIGHT = 321;


@connect(
  ({gardenDetail}) => {
    let {isMasterMode, masterGardenMode, friendGardenMode} = gardenDetail,
    gardenMode = isMasterMode ? masterGardenMode : friendGardenMode;
    return {
      gardenMode,
    };
  },
  dispatch => bindActionCreators({
    switchHistoryGardenMode,
    setIllustration,
    switchShowReplantBox
  }, dispatch),
  null,
  {withRef: true},
)
export default class IllustrationBox extends PureComponent {
  static current = {visible: false};

  constructor(props) {
    super(props)
    this.state = {
      illList: [],
    }
    this.refPagetrunref = ReduxUtil.createRef();

    this.displayAnim = new Animated.Value(1);
    this.originDragPointPageY = 0; // 拖动起始的Y坐标

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder,
      onPanResponderTerminationRequest: () => true,
      onPanResponderMove: this.dragMoving,
      onPanResponderReject: this.dragMoving,
      onPanResponderRelease: this.dragEnded,
      onResponderTerminate: this.dragEnded,
    });
  }

  componentDidMount() {
    IllustrationBox.current.visible = true
    this.fetchData()
  }

  componentWillUnmount() {
    IllustrationBox.current.visible = false
  }

  render() {
    const {illList} = this.state
    return (
      <View style={styles.illContainer} >
        <TouchableOpacity style={{flex: 1}} onPress={() => this.props.hideIllBox()} activeOpacity={1}/>
        <Animated.View
          style={[styles.container, {
            height: PORTRAIT_HEIGHT,
            transform: [{
              translateY: this.displayAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [PORTRAIT_HEIGHT, 0],
              }),
            }],
            opacity: this.displayAnim,
          }]}
        >
          <View
            style={styles.topBox}
            {...this.panResponder.panHandlers}
          >
            <WebImage name="illustration_icon" style={styles.icon}/>
            <Text style={styles.titleName}>图鉴</Text>
            <View style={styles.topPushBtn}/>
          </View>
          <View style={{flex: 1, paddingLeft: 20}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
            {!!illList.length && illList.map(this.renderListItem)}
            {this.renderProducting()}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    )
  }
  renderProducting = () => {
    return (
      <View style={[styles.itemBox, {backgroundColor: '#EFEFEF'}]}>
        <View style={{flex: 1}} >
          <WebImage name="producting_rose" style={styles.flowerImage}/>
          <View style={[styles.frontBottomBox, {backgroundColor: '#FFC99B'}]}>
            <Text style={styles.frontFlowerName} numberOfLines={1}>???</Text>
            <Text style={styles.frontPlantNum}>新品研发中</Text>
          </View>
        </View>
      </View>
    )
  }
  _renderFront= (item) => {
    const picName = IllustrationItem.getFrontBackGroundPic(item)
    return (
      <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => this.goToIllustration(item)}>
        <WebImage name={picName} style={styles.flowerImage}>
          {item.planting &&
            (<View style={styles.frontPlantStatusBox}>
              <Text style={styles.frontPlantStatusText}>培育中</Text>
             </View>)
          }
        </WebImage>
        <View style={styles.frontBottomBox}>
          <Text style={styles.frontFlowerName} numberOfLines={1}>{item.name}</Text>
          {!!item.completes && <Text style={styles.frontPlantNum}>已养成{item.completes}次</Text>}
        </View>
      </TouchableOpacity>
    )
  }

  fetchData = () => {
    fetchFlowerIllustration().then((data) => {
      this.setState({
        illList: data
      })
    })
  }

  renderListItem = (item) => {
    const {completes, planting} = item
    if(completes) { // 已经种成功的花跳转到图鉴页面
      return (
        <View style={styles.itemBox}>
          {this._renderFront(item)}
        </View>
      )
    }
    if(planting) { // 正在培育中的花
      return (
        <IllustrationItem
          item={item}
        />
      )
    }
    if(!item.completes && !item.planting) { // 未获得的花
      return (
        <IllustrationItem
          item={item}
        />
      )
    }
  }

  onMoveShouldSetPanResponder = ({nativeEvent}, {dx, dy, vx, vy, numberActiveTouches}) => { // moveX, moveY, x0, y0,
    let {pageY} = nativeEvent;// pageX,
    // 单指触控, 方向和速度都明显偏向于Y轴, 才认定为拖曳过程
    if(numberActiveTouches === 1 && Math.abs(dy) > Math.abs(dx) + 5 && Math.abs(vy) > Math.abs(vx) + 0.1) {
      this.originDragPointPageY = pageY;
      return true;
    }
    return false;
  };

  dragMoving = ({nativeEvent}) => {
    let {pageY} = nativeEvent, // pageX,
      contentHeight = PORTRAIT_HEIGHT,
      targetPageY = Math.max(pageY, this.originDragPointPageY);
    this.displayAnim.setValue(1 - (targetPageY - this.originDragPointPageY) / contentHeight);
  };

 dragEnded = () => {
    if(this.displayAnim._value > 0.75) { // 拖动距离小于总高度的1/4, 复位
      Animated.timing(this.displayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else { // 关闭
      this.closeSelf();
    }
  }

  closeSelf = () => {
    Animated.timing(this.displayAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start(() => {
      this.props.hideIllBox()
    });
  };

  goToIllustration = (item) => {
    const rseat = item.channelCode === GARDEN_ENUM.CHANNEL_CODE.Rose ? 'book_rose' : 'book_money'
    const block = item.channelCode === GARDEN_ENUM.CHANNEL_CODE.Rose ? 'result_rose' : 'result_money'
    sendClickPingback('flower_page', 'book', rseat)
    sendBlockPingback('flower_page', block)
    this.props.hideIllBox()
    this.props.setIllustration(item)
    this.props.switchHistoryGardenMode(item.channelCode);
    this.props.switchShowReplantBox(false)
  }
}

const styles = BaseStyleSheet.create({
  container: {
    position: 'absolute',
    width: Width,
    height: 321,
    bottom: 0,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15

  },
  topBox: {
    width: Width,
    height: 62,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    flexDirection: 'row',
    alignItems: 'center'
  },
  topPushBtn: {
    backgroundColor: '#D2D2D2',
    height: 5,
    width: 55,
    borderRadius: 5,
    position: 'absolute',
    top: 15,
    left: (Width - 55) / 2
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 17,
    marginRight: 10
  },
  titleName: {
    fontSize: 16,
    color: '#333333'
  },
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
    maxWidth: 60
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
    fontSize: 14
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
  pageTurnBtn: {
    position: 'absolute',
    right: 8,
    top: 8
  },
  turnBtnIcon: {
    width: 17,
    height: 17
  },
  backGroundOfBack: {
    width: 135,
    height: 207,
    paddingHorizontal: 12,
    paddingTop: 15
  },
  itemBox: {
    width: 135,
    height: 207,
    alignSelf: 'center',
    borderRadius: 10,
    marginRight: 10,
    overflow: 'hidden'
  },
  flowerImage: {
    width: 135,
    height: 160
  },
  illContainer: {
    width: Width,
    height: Height,
    position: 'absolute',
    alignSelf: 'center'
  }
})
