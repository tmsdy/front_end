/**
 * 帮助弹框
 * Created by xushichao on 2018-12-12.
 */
import React, {PureComponent} from 'react';
import {ScrollView} from 'react-native';
import {View, Text} from '@iqiyi/rn-ui';
import {isIOS} from '@iqiyi/rn-utils'
import WebImage from '../WebImage';

const RULE_TEXT = [
  {
    text: '每天花5积分浇水，花儿会随时间逐渐生长，在第3、7、12天更有神秘奖励~',
    lineImage: {
      name: 'flower_box_grow',
      style: {width: 202, height: 44, marginBottom: 15}
    },
    dotText: null

  },
  {
    text: '如果有一天没有浇水，它就会枯萎了......这时候你的会员卡只能前功尽弃，从头再来。',
    lineImage: {
      name: 'flower/leaf_help',
      style: {width: 45, height: 45}
    },
    dotText: null
  },
  {
    text: '温馨提示：所有奖励必须当天领取，隔天它就飞走了哦~',
    lineImage: null,
    dotText: null
  },
  {
    text: '复活肥在一个花期内，只能使用2次哦~别想着每天不浇水，靠复活肥过日子！',
    lineImage: null,
    dotText: [
      '邀请好友就能获得1袋,无数量限制.',
      '被邀请好友只要登录爱奇艺账号也能获得1袋,若再次被邀请，则无法获取',
      '捕捉蜜蜂运气好的话也可以获得1袋'
    ]
  },
  {
    text: '浇水后，花儿就会引蜜蜂哦~每天至少出现3只，捕捉蜜蜂会获得积分、道具以及优惠券等礼物哦~',
    lineImage: null,
    dotText: null
  },
  {
    text: `你可以发发善心，帮Ta浇水；也可以使使坏，捕捉Ta的蜜蜂，并拿走Ta的奖励。但是好友无法拿走你的${isIOS ? '果实奖励' : 'VIP卡的'}。`,
    lineImage: null,
    dotText: null
  }
]
export default class HelpModal extends PureComponent {
  render() {
    return (
      <WebImage name="flower_box" style={styles.flowerBox}>
        <WebImage name="flower_box_title" style={styles.flowerBoxTitle}/>
        <ScrollView style={{width: 306, height: 461}}>
          <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 20}}>
            <Text style={styles.flowerBoxDesc}>你在爱奇艺获得了一颗魔法种子，把它种下，连续21天给它浇水，会回赠给你爱奇艺{isIOS ? '惊喜大礼包' : 'VIP天卡'}哦！</Text>
              {RULE_TEXT.map((item, index) => {
                if(index === 4) {
                  return (
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <View style={styles.flowerBoxParagraph}>
                        {this.renderOrderNumber(index + 1)}
                        <Text style={[styles.flowerBoxParagraphText]}>
                          <WebImage name="flower/bee_help" style={{width: 40, height: 30}}/>
                          {item.text}
                        </Text>
                      </View>
                    </View>
                  )
                }
                return (
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <View style={styles.flowerBoxParagraph}>
                      {this.renderOrderNumber(index + 1)}
                      <Text style={styles.flowerBoxParagraphText}>{item.text}</Text>
                    </View>
                    {!!item.lineImage && <WebImage name={item.lineImage.name} style={item.lineImage.style}/>}
                    {index === 3 &&
                      (
                        <View style={{flexDirection: 'row', marginLeft: 20, alignItems: 'center'}}>
                          <WebImage name="flower/fertilizer_help" style={{width: 30, height: 30}}/>
                          <Text style={styles.flowerBoxParagraphText}>复活肥获取方法:</Text>
                        </View>
                      )
                    }
                    {!!item.dotText && item.dotText.map((dotText) => {
                      return (
                        <View style={styles.fertilizerRule}>
                          <WebImage name="flower/dot_help" style={styles.dotImage}/>
                          <Text style={styles.flowerBoxParagraphText}>{dotText}</Text>
                        </View>
                      )
                    })}
                  </View>
                )
              })}
          </View>
        </ScrollView>
      </WebImage>
    );
  }

  renderOrderNumber = (order) => {
    return (
      <View style={styles.flowerBoxOrder}>
        <Text style={styles.flowerBoxOrderText}>{order}</Text>
      </View>
    );
  };
}

const styles = BaseStyleSheet.create({
  flowerBox: {
    width: 306,
    height: 461,
    alignItems: 'center',
    paddingBottom: 30,
  },
  flowerBoxTitle: {
    width: 165,
    height: 25,
    marginTop: 24,
    marginBottom: 15,
  },
  flowerBoxDesc: {
    fontSize: 14,
    color: '#333',
    marginBottom: 30,
  },
  flowerBoxParagraph: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  flowerBoxOrder: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: 'rgba(11,190,6,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  flowerBoxOrderText: {
    color: '#0BBE06',
  },
  flowerBoxParagraphText: {
    fontSize: 14,
    color: '#666',
    flex: 1
  },
  flowerBoxParagraphTextActive: {
    color: '#0BBE06',
  },

  flowerGrewImg: {
    width: 202,
    height: 44,
    marginBottom: 10,
  },
  flowerFadedImg: {
    width: 96,
    height: 43,
    marginBottom: 15,
  },
  fertilizerRule: {
    flexDirection: 'row',
    marginLeft: 20,
    alignItems: 'baseline'
  },
  dotImage: {
    width: 5,
    height: 5,
    marginRight: 5
  },
  leaf: {
    width: 45,
    height: 45
  }
});

