/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 活动卡片轮播card 目前有 宝箱|问答|话题PK三种类型card
 * @Date: 2019-04-18 14:34:19
 */
import React, {PureComponent} from 'react';
import {UIManager, findNodeHandle} from 'react-native';
import Swiper from '@iqiyi/rn-snap-carousel';
import {Width, isIOS} from '@iqiyi/rn-utils';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {View, Pagination} from '@iqiyi/rn-ui';
import BaseStyleSheet from '../../common/BaseStyleSheet';
import DrawBox from './DrawBox';
import DrawBoxGuideAnimation from './DrawBoxGuideAnimation';
import {fetchActivityCardData, fetchAwardsInfo, fetchActivityCardResource} from '../../model/homePage';
import {DrawBoxData, AwardResultInfo} from '../../typings/apis/homePage';
import {setUnreceiveScore} from '../../actions/QuestionActions';
import {setTotalScore} from '../../actions/TotalScoreActions';
import {setStorage, getStorage} from '../../common/util';
import ReduxUtil from '../../common/ReduxUtil';
import TopicPkCard from './TopicPKCard';
import AnswerCard from './AnswerCard';
import {fetchUnreceiveScore} from '../../model/question/questionSubmit';

const DRAW_BOX_WIDTH = Width - 55; // 宝箱宽度
const DRAW_BOX_HEIGHT = 0.968 * DRAW_BOX_WIDTH; // 宝箱高度
const guideAnimationKey = 'SHOW_GUIDE_ANIMATION'; // 新手引导动画的localstorage key
const TIME = 2 * 60 * 1000; // 定时器时间
interface SwiperActivityProps {
  totalScore: number; // 用户总积分
  openWeb?(name: string): void;
  goTo?(name: string): void;
  setUnreceiveScore?: Function;
  setTotalScore?: Function; // 设置用户总积分
  refScroll?: any;
  screenProps?: any;
}
interface State {
  activeSlide: number;
  drawBoxList: DrawBoxData[];
  marqueeList: AwardResultInfo[];
  showGuideAnimation: boolean;
  topicPkCount: number;
}
@(connect(
  null,
  dispatch =>
    /* eslint implicit-arrow-linebreak: off */
    bindActionCreators(
      {
        setUnreceiveScore,
        setTotalScore
      },
      dispatch
    ),
  null,
  {withRef: true}
) as any)
export default class SwiperActivity extends PureComponent<SwiperActivityProps, {}> {
  state: State = {
    activeSlide: 0, // 当前显示的card
    drawBoxList: [], // cardlist
    marqueeList: [], // 文本走马灯列表数据
    showGuideAnimation: false, // 是否显示新手引导动画
    topicPkCount: 0, // 话题PK需要用到的数量
  };

  refSwiperCard = ReduxUtil.createRef();

  marqueeListTimer = null; // 弹幕定时器，每隔2分钟刷新一次

  componentDidMount() {
    this._showGuideAnimation();
    this.fetchData();
    this.marqueeListTimer = setInterval(() => {
      this.refreshAwards();
    }, TIME);
    // 小程序助力抽奖分享页面唤醒任务中心页面 定位到宝箱位置
    this.scrollToDrawBox();
  }

  componentWillUnmount() {
    this.marqueeListTimer && clearTimeout(this.marqueeListTimer);
  }

  render() {
    const {drawBoxList, showGuideAnimation} = this.state;
    return (
      <View style={styles.swiperWrap} ref={this.refSwiperCard}>
        <Swiper
          data={drawBoxList}
          itemWidth={DRAW_BOX_WIDTH}
          itemHeight={DRAW_BOX_HEIGHT}
          sliderWidth={Width}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={1}
          contentContainerCustomStyle={{marginLeft: 15}}
          activeSlideAlignment="start"
          onSnapToItem={index => this.setState({activeSlide: index, showGuideAnimation: false})}
          renderItem={this._renderItem}
        />
        {drawBoxList.length >= 2 ? (
          <Pagination
            dotsLength={drawBoxList.length}
            activeDotIndex={this.state.activeSlide}
            dotContainerStyle={{marginHorizontal: 2.5}}
            containerStyle={{alignSelf: 'center', paddingHorizontal: 0, paddingVertical: 0, marginTop: 7}}
            dotStyle={{backgroundColor: '#FF410F', height: 5, width: 10, borderRadius: 2.5}}
            inactiveDotStyle={{backgroundColor: '#eeeeee', height: 5, width: 5, borderRadius: 2.5}}
            inactiveDotOpacity={1}
            inactiveDotScale={1}
          />
        ) : null}
        <DrawBoxGuideAnimation showGuideAnimation={showGuideAnimation} />
      </View>
    );
  }

  // swiper item
  _renderItem = ({item}) => {
    return <View style={{width: DRAW_BOX_WIDTH, height: DRAW_BOX_HEIGHT}}>{this._renderInnerItem({item})}</View>;
  };

  fetchData = () => {
    // TODO: 话题PK、问答、宝箱数量和排序字段从资源位获取
    fetchActivityCardResource().then(data => {
      Promise.all([fetchAwardsInfo(), fetchActivityCardData(data)])
        .then(([marqueeList, drawBoxList]) => {
          this.setState({
            drawBoxList,
            marqueeList
          });
        })
        .catch(() => {
          this.setState({
            drawBoxList: [],
            marqueeList: []
          });
        });
    });

    // 问答红点逻辑
    fetchUnreceiveScore().then(data => {
      this.props.setUnreceiveScore(data);
    });
  };

  // 刷新获奖信息
  refreshAwards = () => {
    fetchAwardsInfo().then(marqueeList => {
      this.setState({
        marqueeList
      });
    });
  };

  // 定位到宝箱位置
  scrollToDrawBox = () => {
    try {
      // 加延时是因为ref的实例引用不一定存在
      const {screenProps: {fromWXPage = ''} = {}} = this.props;
      setTimeout(() => {
        if(fromWXPage === 'boost') {
          this.refSwiperCard.getInstance().then(ref => {
            UIManager.measure(findNodeHandle(ref), (_x, y) => {
              this.props.refScroll.getInstance().then(scrollRef => {
                scrollRef.scrollTo({x: 0, y: isIOS ? y : 500, animated: true});
              });
            });
          });
        }
      }, 2000);
    } catch(error) {
      //
    }
  };

  /**
   * @description: 是否显示新手引导动画 首次进入出现新手引导，非首次进入则不出现：
   */
  _showGuideAnimation() {
    getStorage(guideAnimationKey).then((info = {}) => {
      if(info.value === 1) {
        this.setState({
          showGuideAnimation: false
        });
      } else {
        this.setState(
          {
            showGuideAnimation: true
          },
          () => {
            setStorage(guideAnimationKey, {value: 1});
          }
        );
      }
    });
  }

  _renderInnerItem({item}) {
    if(item.activityCardType === 'baoxiang') {
      return (
        <DrawBox
          drawBoxData={item}
          marqueeList={this.state.marqueeList}
          fetchData={this.fetchData}
          totalScore={this.props.totalScore}
          goTo={this.props.goTo}
          setTotalScore={this.props.setTotalScore}
          refreshAwards={this.refreshAwards}
        />
      );
    }
    if(item.activityCardType === 'huati') {
      return (
        <TopicPkCard
          item={item}
          totalScore={this.props.totalScore}
          goTo={this.props.goTo}
          isLogin={global.USER_INFO.isLogin}
          count={this.state.topicPkCount}
          fetchData={this.fetchData}
          itemWidth={DRAW_BOX_WIDTH}
          itemHeight={DRAW_BOX_HEIGHT}
        />
      );
    }
    if(item.activityCardType === 'naodong') {
      return <AnswerCard item={item} goTo={this.props.goTo} openWeb={this.props.openWeb} />;
    }
    return null;
  }
}

const styles = BaseStyleSheet.create({
  swiperWrap: {
    flex: 1,
    marginTop: 25,
    marginBottom: 30
  }
});
