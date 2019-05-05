/**
 * 花儿日记弹窗
 */

import React, {PureComponent} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {View, Text, Image} from '@iqiyi/rn-ui';

import WebImage from '../WebImage';

import {fetchDiaryDataByPage} from '../../model/MyFlower';
import {concatDiaryList, clearDiaryList, switchToFriendGardenMode} from '../../actions/GardenDetailActions';
import {STORAGE_ENUM} from '../../constants/IntegralEnum';
import {getStorage, setStorage} from '../../common/util';

const DIARY_TYPE_PIC = {
  0: {name: 'flower/diary_seed', width: 20, height: 20}, // 刚种未浇水
  1: {name: 'flower/diary_water', width: 20, height: 20}, // 好友给我浇水
  2: {name: 'flower/diary_water', width: 20, height: 20}, // 软文
  3: {
    rose: {name: 'flower/diary_rose', width: 20, height: 20}, // 花儿成熟
    money: {name: 'flower/diary_money', width: 20, height: 20}, // 花儿成熟
    genius: {name: 'flower/diary_genius', width: 20, height: 20}
  },
  4: {name: 'flower/diary_fertilizer', width: 20, height: 20}, // 花儿复活
  5: {name: 'flower/diary_bee', width: 20, height: 20}, // 好友捕捉我蜜蜂
  6: {name: 'flower/diary_eradicate', width: 22, height: 22}, // 铲除初代花
}
const EMOTION = {
  happy: 'diary_smile',
  down: 'dairy_sad',
  normal: 'diary_peace'

}

function format(contents) {
  const resultList = [[]]
  if(contents.length) {
    contents.forEach((item) => {
      if(!resultList[0].length) {
        resultList[0][0] = item
      } else {
        const dataLength = resultList.length
        const lastGroup = resultList[dataLength - 1]
        const lastData = lastGroup[lastGroup.length - 1]
        if(item.dateStr === lastData.dateStr) {
          resultList[resultList.length - 1].push(item)
        } else {
          resultList[resultList.length] = [item]
        }
      }
    })
  }
  return resultList
}

interface DiaryModalProps {
  diaryList: any[];
  masterUserId: string | number;
  initDiary: any[];
  clearDiaryList: Function;
  concatDiaryList: Function;
  switchToFriendGardenMode: Function;
}

interface DiaryModalState {
  loaded: boolean;
  hasRequestDone: boolean; // 是否完成过请求
  hasShowCover: boolean; // 是否展示过日历封面
}

@(connect(
  ({gardenDetail}) => {
    return {
      diaryList: format(gardenDetail.diaryList),
      masterUserId: gardenDetail.masterUserId,
      initDiary: gardenDetail.diaryList
    }
  },
  dispatch => bindActionCreators({
    concatDiaryList,
    clearDiaryList,
    switchToFriendGardenMode
  }, dispatch),
  null,
  {withRef: true},
) as any)
export default class DiaryModal extends PureComponent<DiaryModalProps, DiaryModalState> {
  private requestLock = false;
  private pageSize = 20; // 每页获取的数量
  private pageNo = 0; // 当前页号
  private totalDiaryCount = 0; // 总的好友数

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      hasRequestDone: false, // 是否完成过请求
      hasShowCover: false, // 是否展示过日历封面
    }
  }

  componentDidMount() {
    this.getRenderData()
  }

  render() {
    const {diaryList} = this.props
    const {loaded, hasShowCover, hasRequestDone} = this.state
    if(!hasRequestDone || !loaded) {
      return (
        <View style={[styles.modalContainer, {backgroundColor: 'transparent'}]}/>
      )
    }
    if(!hasShowCover) {
      return (
        <TouchableOpacity activeOpacity={1} onPress={this._onPress}>
          <WebImage name="flower/diary_cover" style={{width: 304, height: 467}}/>
        </TouchableOpacity>
      )
    }
    return (
      <View style={styles.modalContainer}>
        <View style={styles.titleBox}>
            <View style={styles.titleLine}/>
            <Text style={styles.titleText}>花儿日记</Text>
            <View style={styles.titleLine}/>
        </View>
        {(
          diaryList[0].length ? (
            <View style={styles.scrollContainer}>
              <FlatList
                style={{flex: 1, height: 100}}
                showsHorizontalScrollIndicator={false}
                horizontal={false}
                data={diaryList}
                renderItem={this.renderDiaryItem}
                onEndReached={this.onEndReached}
                // scrollToEnd={this.scrollToEnd}
                onEndReachedThreshold={0.1}
                ListFooterComponent={this._ListFooterComponent}
              />
            </View>
          ) : (
            <View style={styles.diaryNoneBox}>
              <Image source={{uri: 'integral_diary_kong'}} style={styles.diaryNonePic} />
              <Text style={styles.diaryNoneText}>浇完水后，我就会开始写日记啦</Text>
            </View>
          )
        )}
      </View>
    )
  }

  getRenderData = () => {
    if(this.props.masterUserId) {
      this.fetchIsShowDiaryCover()
      this.fetchDiaryList(false)
    } else {
      this.setState({
        hasRequestDone: true,
        loaded: true,
        hasShowCover: true
      })
    }
  }

  fetchIsShowDiaryCover = () => {
    getStorage(STORAGE_ENUM.HASSHOW_DIARY_COVER).then((data) => {
      this.setState({
        hasShowCover: data
      }, () => {
        if(!data) {
          setStorage(STORAGE_ENUM.HASSHOW_DIARY_COVER, true)
        }
      })
    }).finally(() => {
      this.setState({
        loaded: true
      })
    })
  }

  _onPress = () => {
    this.setState({
      hasShowCover: true
    })
  }

  renderDiaryItem = ({item}) => {
    const flowerName: any = this.getFlowerName(item[0])
    const day = this.formatDateOfWater(item[0].timestamp)
    return (
      <View key={item[0].timestamp}>
        <View style={styles.itemTopPart} >
          <View style={styles.dateBox}>
            <Text style={styles.day}>{day.day}</Text>
            <Text style={styles.month}>{day.year}/{day.month}</Text>
          </View>
          <WebImage name={flowerName.name} style={styles.moodPic}/>
        </View>
       {item.map((action) => {
         return (
           this.renderPerDayContent(action)
         )
       })}
      </View>
    )
  }

  renderPerDayContent = (item) => {
    const leftIcon = this.getLeftIconOfDiary(item)
    const {nickname = ''} = item.extInfo || {}
    return (
      <View style={styles.itemContent}>
        <WebImage name={leftIcon} style={styles.flowerPic} />
        <Text style={[styles.diaryContent, {marginBottom: 23}]}>
          {!!nickname && <Text style={styles.diaryName}>{nickname} </Text>}
          {nickname ? item.content.split(nickname)[1] : item.content}
        </Text>
      </View>
    )
  }

  _ListFooterComponent = () => {
    return (
      <Text style={{color: '#999999', fontSize: 12, textAlign: 'center', marginBottom: 10}}>最多展示三个月的日记哦~</Text>
    )
  }

  onEndReached = () => {
    this.fetchDiaryList(true)
  }

  fetchDiaryList = (isAppend) => {
    this.pageNo = isAppend ? this.pageNo + 1 : 0;
    if(this.requestLock || (this.props.initDiary.length >= this.totalDiaryCount && this.pageNo > 0)) {
      return;
    }
    this.requestLock = true;

    const param = {
      pageSize: this.pageSize,
      page: this.pageNo,
    };
    fetchDiaryDataByPage(param).then(({contents, total}) => {
      if(contents && contents.length) {
        if(!isAppend) {
          this.props.clearDiaryList();
        }
        this.props.concatDiaryList(contents);
        this.totalDiaryCount = total;
        this.requestLock = false;
      }
    }).finally(() => {
      this.setState({hasRequestDone: true});
    });
  }

  getFlowerName = (item) => {
    const {type, channelCode} = item
    let flowerName = {}
    if(type === 0) {
      flowerName = DIARY_TYPE_PIC[type]
    } else {
      flowerName = DIARY_TYPE_PIC[3][channelCode]
    }
    return flowerName
  }

  getLeftIconOfDiary = (item) => {
    const {type, extInfo} = item
    let icon = ''
    if(type === 2 && extInfo && extInfo.emotion) {
      icon = EMOTION[extInfo.emotion]
    } else {
      icon = DIARY_TYPE_PIC[type].name
    }
    return icon
  }

  formatDateOfWater = (date) => {
    const day = new Date(date);
    return {
      day: `0${day.getDate()}`.substr(-2),
      month: `0${day.getMonth() + 1}`.substr(-2),
      year: day.getFullYear(),
    };
  }
}

const styles = global.BaseStyleSheet.create({
  modalContainer: {
    width: 306,
    height: 461,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  titleLine: {
    backgroundColor: '#0BBE06',
    height: 1.5,
    width: 13
  },
  itemTopPart: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    height: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  dateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  day: {
    fontSize: 20,
    color: '#666666',
    lineHeight: 24
  },
  month: {
    fontSize: 10,
    color: '#999999',
    marginLeft: 5
  },
  diaryContent: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'left',
    flex: 1,
    marginLeft: 5
  },
  titleText: {
    fontWeight: global.BaseStyleSheet.FontWeight.Medium,
    color: '#333333',
    lineHeight: 25,
    fontSize: 18,
    marginHorizontal: 7
  },
  diaryNoneBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  diaryNonePic: {
    width: 150,
    height: 150,
    marginTop: -90
  },
  diaryNoneText: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 20
  },
  flowerPic: {
    width: 20,
    height: 20,
  },
  moodPic: {
    width: 20,
    height: 20
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  scrollContainer: {
    width: 306,
    paddingHorizontal: 20,
    marginBottom: 10,
    flex: 1
  },
  diaryName: {
    color: '#333',
    fontWeight: '700',
    paddingRight: 5,
  }
})
