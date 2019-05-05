/**
 * 积分明细
 */
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ListView,
} from 'react-native';
import {
  isIOS,
  Width as width
} from '@iqiyi/rn-utils'
import {View, Text, ActivityIndicator} from '@iqiyi/rn-ui';
import WebImage from '../components/WebImage';
import NavBar from '../components/DefaultNavBar';
import {getIntegralList, getUserInfo} from '../api/index';
import {unixTimeToFormat, createUrl} from '../common/util';
import {hideLoading, showToast} from '../common/QYNativeBridge';
import BasePage from '../components/BasePage';
import {sendPagePingback} from '../common/pingback';

let ds;

interface IntegralDetailState {
  listData: any;
  totalScore: number | string;
  initLoading: boolean;
  loadMoreLoading: boolean;
  hasNoData: boolean;
  hasMore: boolean;
  requestFail: boolean;
  lastPeriodScore: number;
}

export default class IntegralDetail extends BasePage<{}, IntegralDetailState> {


  pageName = 'score_details';

  constructor(props) {
    super(props);
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.listArray = [];
    this.requestStatu = false; // 上拉加载更多锁
    this.state = {
      listData: ds.cloneWithRows([]),
      totalScore: '', // 用户总的积分值
      initLoading: true, // 开始请求接口
      loadMoreLoading: false, // 上拉加载更多开始请求接口
      hasNoData: false, // 该用户没有积分明细
      hasMore: true, // 是否还有更多数据
      requestFail: false, // 接口请求失败
      lastPeriodScore: 0, // 上个周期遗留积分
    };
  }

  componentDidMount() {
    sendPagePingback(this.pageName)
    setTimeout(() => {
      const params = {
        needExpire: 1
      }
      hideLoading()
      this._getUserInfo(params)
      this.getIntegralData()
    }, 400)
  }

  _getUserInfo = (params) => {
    getUserInfo(params)
      .then((data) => {
        const {totalScore, lastPeriodScore} = data[0]
        this.setState({
          totalScore,
          lastPeriodScore
        })
      })
      .catch()
  }

  getIntegralData() {
    if(!this.state.hasMore || this.requestStatu) {
      return;
    }
    this.requestStatu = true;

    const param = {
      timeStamp: this.timeStamp || Date.now(),
      pageSize: 10
    }

    getIntegralList(param)
      .then((data) => {
        this.requestStatu = false;
        this.listArray = this.listArray.concat(data.list);
        this.timeStamp = data.timestamp;
        const temp = this.listArray.length === 0;
        const tempHasmore = data.hasMore;
        if(!tempHasmore) { // 没有更多数据的时候展示仅展示近三个月的数据
          this.listArray.push({noMoreDate: true});
        }
        this.setState({
          listData: ds.cloneWithRows(this.listArray),
          totalScore: data.totalScore,
          loadMoreLoading: false,
          initLoading: false,
          hasNoData: temp,
          hasMore: tempHasmore
        });
      })
      .catch((err) => {
        showToast(err.message)

        this.setState({
          initLoading: false,
          requestFail: true
        })
      });
  }

  _renderItem(item) {
    if(!this.state.hasNoData && item.noMoreDate) {
      return (
        <View
          style={{
            width: width - 15,
            height: 30,
            marginTop: 19,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{fontSize: 13, color: '#999999'}}>仅展示最近三个月的数据</Text>
        </View>
      );
    }
    const status = item.scoreType === 'INCREASE' ? '+' : '';
    const statusColor = status === '+' ? styles.changeTypeOrange : styles.changeTypeGreen;
    const scoreColor = status === '+'
        ? {
          color: '#FF6600',
          fontSize: 18,
          marginRight: 15,
          fontWeight: isIOS ? '500' : '400'
        }
        : {
          color: '#00D600',
          fontSize: 18,
          marginRight: 15,
          fontWeight: isIOS ? '500' : '400'
        };
    const date = unixTimeToFormat(item.eventTime);
    return (
      <View style={styles.listItem}>
        <View style={styles.channelName}>
          <Text style={styles.getType}>
            {item.channelName}
          </Text>
          <Text style={styles.date}>
            {date}
          </Text>
        </View>
        <View style={styles.score}>
          <Text style={statusColor}>
            {status}
          </Text>
          <Text style={scoreColor}>
            {item.score}
          </Text>
        </View>
      </View>
    );
  }

  _onEndReached = () => {
    if(this.requestStatu || !this.state.hasMore) {
      return;
    }

    this.setState({loadMoreLoading: true});
    this.getIntegralData();
  }

  _goRule = () => {
    this.goTo('IntegralRule');
  }

  _renderRightView = () => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={this._goRule}>
        <View style={{
          height: 44,
          justifyContent: 'center'
        }}
        >
          <Text style={{color: '#666', fontSize: 14}}>积分规则</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _goToMarket = () => {
    const getData = {
      uid: global.USER_INFO.userId,
      credits: this.state.totalScore,
      timestamp: new Date().getTime(),
      appKey: 'basic_h5',
    };
    const url = 'https://community.iqiyi.com/openApi/score/exemptLogin';
    const _url = createUrl(url, getData);
    this.openWeb(_url);
  };

  render() {
    const {initLoading} = this.state
    return (
      <View style={styles.container}>

        <WebImage name="jfmx_right_circle" style={styles.jfmx_right_circle}/>
        <WebImage name="jfmx_left_circle" style={styles.jfmx_left_circle}/>
        <NavBar
          title="积分明细"
          backPress={this.back}
          renderRightView={this._renderRightView}
          rightViewWidth={70}
          backgroundColor="#fff"
          titleColor="#333"
          type="black"
        />
        {
          initLoading && this._renderHeader()
        }
        {
          initLoading
          && (
            <View
              style={{
                flex: 1,
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator text="内容即将呈现..."/>
            </View>
          )
        }
        <View style={styles.listBox}>
          {this.state.hasNoData ? (
            <View style={styles.noscore}>
              <WebImage
                name="pic"
                style={{
                  width: 180,
                  height: 180
                }}
              />
              <Text style={styles.noIntegral}>暂无积分记录，快去做任务赚积分吧</Text>
            </View>
          ) : (
            <ListView
              enableEmptySections={true}
              renderHeader={initLoading ? null : this._renderHeader}
              initialListSize={10}
              onEndReachedThreshold={10}
              onEndReached={this._onEndReached}
              dataSource={this.state.listData}
              renderRow={rowData => this._renderItem(rowData)}
            />
          )}
          {(this.state.loadMoreLoading && !this.state.requestFail)
          && (
            <View
              style={{
                height: 30,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ActivityIndicator text="内容即将呈现..."/>
            </View>
            )
          }
          {!!this.state.requestFail
            && (
            <View
              style={{
                width,
                height: 30,
                marginTop: 19,
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{fontSize: 13, color: '#999999'}}>服务器异常请稍后再试...</Text>
            </View>
            )
          }
        </View>
      </View>
    );
  }

  _renderHeader = () => {
    return (
      <WebImage name="jfmx_tbg" style={styles.barTitle}>
          <View style={{flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width,
          }}
          >
          <Text style={styles.totalScore}>
            {this.state.totalScore}
          </Text>
          <WebImage
            name="980_score"
            style={{
              width: 25,
              height: 25,
              marginTop: 1
            }}
          />
          </View>
          {this._renderPastScore()}
      </WebImage>
    )
  }

  _renderPastScore = () => {
    if(this.state.lastPeriodScore) {
      return (
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.noticeTitle}>
          {`您${new Date().getFullYear() - 1}年获得的${this.state.lastPeriodScore}积分将于今年6月1日过期`}
          </Text>
        </View>
      )
    }
    return null
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    marginBottom: 8
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  rightTopBtn: {
    color: '#ffffff'
  },
  scoreTitle: {
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 15
  },
  totalScore: {
    fontSize: 30,
    color: '#ffffff',
  },
  barTitle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height: width * 0.24
  },
  market: {
    backgroundColor: '#FF7E00',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleContent: {
    marginTop: 30,
    textAlign: 'center',
    color: '#ffffff',
    justifyContent: 'center',
    fontSize: 16
  },
  marketBtn: {
    color: '#FCFF00',
    fontSize: 14
  },
  noticeTitle: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 15
  },
  listBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  listItem: {
    width: width - 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginLeft: 15,
  },
  channelName: {
    marginTop: 15
  },
  getType: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 25
  },
  date: {
    color: '#999999',
    fontSize: 12,
    lineHeight: 18.5
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  changeTypeOrange: {
    color: '#FF6600',
    fontSize: 18,
    fontWeight: isIOS ? '500' : '400'
  },
  changeTypeGreen: {
    color: '#00D600',
    fontSize: 18,
    fontWeight: isIOS ? '500' : '400'
  },
  noIntegral: {
    fontSize: 14,
    color: '#666666',
    marginTop: 19,
    flex: 1
  },
  noscore: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  jfmx_left_circle: {
    position: 'absolute',
    width: 62,
    height: 90,
    left: 0,
    bottom: 39,
    backgroundColor: 'transparent'
  },
  jfmx_right_circle: {
    position: 'absolute',
    width: 30,
    height: 65,
    right: 0,
    top: 329,
    backgroundColor: 'transparent'
  }
})
