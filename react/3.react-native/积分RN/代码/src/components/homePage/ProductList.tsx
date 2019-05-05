/**
 * Created by liuzhimeng.
 * @date 2019-04-19
 * @description 积分中心商品单列表组件
 */

import React, {PureComponent} from 'react'
import {FlatList} from 'react-native'
import {connect} from 'react-redux'
import {View} from '@iqiyi/rn-ui'
import {isIOS} from '@iqiyi/rn-utils'

import BaseStyleSheet, {ViewStyle} from '../../common/BaseStyleSheet'

import TabTitle from '../wonderfulPark/TabTitle'
import ProductItem from './ProductItem'
import ProductDescription, {ProductDescriptionProps} from './ProductDescription'

import {FetchPropsProductItem} from '../../typings/apis/homePage'
import {createUrl, filterExts, goToDianShangDetail} from '../../common/util'
import {GET_ENV, BASE_URL} from '../../constants/configs'
import {sendBlockPingback, sendClickPingback} from '../../common/pingback'

const THEME_CONFIG = {
  normal: {
    containerStyle: {},
    wrapperStyle: {},
  },
  board: {
    containerStyle: {
      paddingHorizontal: 15,
    },
    wrapperStyle: {
      padding: 1,
      borderColor: '#E2E2E2',
      borderWidth: isIOS ? 0 : BaseStyleSheet.hairlineWidth,
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
  }
}

type theme = 'normal' | 'board'
type numColumns = 2 | 3
type productType = 'normal' | 'score' // 正常只展示积分，【积分当钱花】模块展示积分+价格+划线价格

interface ProductListProps {
  title: string;
  code: string;
  list: FetchPropsProductItem[];
  theme?: theme;
  productType?: productType;
  numColumns?: numColumns;
  goTo(pageName: string, config: any): void;
  openWeb(url: string): void;

  totalScore?: number;
  from?: 'pointcenter';
}


@(connect(
  (state) => {
    return {
      totalScore: state.scoreInfo.totalScore || 0,
    }
  },
  null,
  null,
  {withRef: true}
) as any)
export default class ProductList extends PureComponent<ProductListProps, {}> {
  static defaultProps = {
    title: '',
    code: '',
    list: [],
    theme: 'normal',
    productType: 'normal',
    from: 'pointcenter',
  }

  componentDidMount() {
    const {code, from} = this.props
    sendBlockPingback(from, code)
  }

  render() {
    const {title, list, theme} = this.props
    const {containerStyle, wrapperStyle} = THEME_CONFIG[theme]

    if(!list.length) return null

    return (
      <View style={[styles.container]}>
        <TabTitle title={title} showLookMore={true} renderLookMoreComponent={null} onPress={this.onTitlePress}/>
        <View style={[styles.listContainer, containerStyle]}>
          <View style={[styles.listContainer, wrapperStyle]}>
            <FlatList
              style={styles.listWrapper}
              data={list}
              numColumns={this.props.numColumns}
              bounces={false}
              keyExtractor={({itemId}) => String(itemId)}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      </View>
    )
  }

  renderItem = ({item, index}) => {
    return (
      <ProductItem
        data={item}
        renderDescComponent={this.renderDesc(item)}
        onPress={() => this.onItemPress(item, index)}
        containerStyle={this.getItemStyle(index)}
      />
    )
  }

  renderDesc = ({score, price, originalPrice, infinity = 0, remain = 0}) => {
    const disabled = infinity === 0 && remain <= 0
    const {productType} = this.props
    let descProps: ProductDescriptionProps = {
      score,
      disabled,
    }

    if(productType === 'score') {
      descProps = {
        score,
        price,
        originalPrice,
        originalPriceUnit: '元'
      }
    }

    return <ProductDescription {...descProps}/>
  }

  getItemStyle = (index: number) => {
    const {list, theme, numColumns} = this.props
    let itemStyle: ViewStyle = {}

    const isLastLineItem = index >= list.length - numColumns

    if(list.length === 1 || (isLastLineItem && list.length % numColumns !== 0)) {
      itemStyle.width = `${100 / numColumns}%`
    } else {
      itemStyle.flex = 1
    }

    if(theme === 'normal') {
      const hairLine = BaseStyleSheet.hairlineWidth

      itemStyle = {
        ...itemStyle,
        borderColor: '#eeeeee',
        borderTopWidth: hairLine,
        borderRightWidth: (index + 1) % numColumns === 0 ? 0 : hairLine,
        borderBottomWidth: isLastLineItem ? hairLine : 0,
      }
    } else {
      itemStyle = {
        ...itemStyle,
        backgroundColor: index % 2 === 1 ? '#F7F7F7' : '#ffffff',
        paddingTop: 5,
        paddingBottom: 9,
        paddingHorizontal: 10,
      }
    }

    return itemStyle
  }

  onTitlePress = () => {
    const {code, list, productType} = this.props
    let params = {}

    // 跳转至 积分购物（积分当钱花）
    if(productType === 'score') {
      params = {
        initialPage: 1,
        initialData: list,
      }
    } else {
      params = {
        partnerCode: code,
        initialData: list,
      }
    }

    this.props.goTo('ShoppingMall', params)
  }

  onItemPress = ({name = '', itemId = '', partnerCode = '', url = null, exts = []}, index: number) => {
    const {productType, code, from} = this.props

    sendClickPingback(from, code, `${partnerCode}_${index + 1}`)

    // 去电商页面
    if(productType === 'score') {
      this.props.openWeb(goToDianShangDetail(itemId))
    } else {

      const clickEvent = filterExts(exts, 'clickEvent', '')

      if(url) {
        const _url = this.getUrl(url)
        this.props.openWeb(_url)
      } else if(clickEvent.toLowerCase() === 'h5') {
        const _url = filterExts(exts, 'h5', '')
        if(_url) {
          this.props.openWeb(_url)
        }
      } else {
        this.props.goTo('GoodsDetail', {name, itemId, code})
      }
    }

  }

  getUrl = (url: string) => {
    const params = {
      uid: global.USER_INFO.userId,
      credits: this.props.totalScore,
      timestamp: Date.now(),
      appKey: 'basic_h5',
      dbredirect: url,
    }
    const exemptUrl = `${BASE_URL.community[GET_ENV()]}/score/exemptLogin`

    return createUrl(exemptUrl, params)
  }

}

const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },

  listContainer: {
    width: '100%',
  },
  listWrapper: {
    width: '100%',
    backgroundColor: 'transparent',
  },
})
