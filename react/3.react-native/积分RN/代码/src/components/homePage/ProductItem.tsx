/**
 * Created by liuzhimeng.
 * @date 2019-04-19
 * @description 积分中心商品列表子项
 */

import React, {PureComponent} from 'react'
import {TouchableOpacity} from 'react-native'
import {View, Text} from '@iqiyi/rn-ui'

import BaseStyleSheet, {ViewStyle} from '../../common/BaseStyleSheet'
import WebImage, {DefaultImage} from '../WebImage'

import {FetchPropsProductItem} from '../../typings/apis/homePage'

interface ProductItemProps {
  data: FetchPropsProductItem;
  renderDescComponent?: React.ReactNode;
  renderBottomComponent?: React.ReactNode;
  containerStyle?: ViewStyle;
  onPress(): void;
}

export default class ProductItem extends PureComponent<ProductItemProps, {}> {
  static defaultProps = {
    renderBottomComponent: null,
  }

  render() {
    const {imgUrl, title, tagOptions} = this.props.data
    const disabledStatus = this.getDisabledStatus()
    const disabledStyle = this.getDisabledStyle()

    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        activeOpacity={1}
        onPress={this.onPress}
      >
        <View style={styles.imageWrapper}>
          <DefaultImage style={[styles.image, disabledStyle]} uri={imgUrl} defaultImage="icon/default-product" />
          {disabledStatus && (
            <View style={styles.soldOut}>
              <Text style={styles.soldOutText}>已兑完</Text>
            </View>
          )}
        </View>
        {(!!tagOptions && !!tagOptions.url) && (
          <WebImage
            style={[styles.tag, tagOptions.size]}
            name={tagOptions.url}
          />
        )}
        <Text style={[styles.sTitle, disabledStyle]} numberOfLines={1}>{title}</Text>
        {this.renderDesc(disabledStyle)}
        {this.props.renderBottomComponent}
      </TouchableOpacity>
    )
  }

  renderDesc = (disabledStyle: any) => {
    const {data: {desc}, renderDescComponent} = this.props

    if(renderDescComponent) {
      return renderDescComponent
    }
    if(desc) {
      return <Text style={[styles.sDesc, disabledStyle]} numberOfLines={1}>{desc}</Text>
    }
  }

  getDisabledStatus = () => {
    const {data: {infinity, remain}} = this.props
    return infinity === 0 && remain <= 0
  }

  getDisabledStyle = () => {
    if(this.getDisabledStatus()) {
      return {
        opacity: 0.5,
      }
    }
    return {}
  }

  onPress = () => {
    this.props.onPress()
  }

}

const styles = BaseStyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 15,
  },
  imageWrapper: {
    alignItems: 'center',
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
  tag: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  sTitle: {
    width: '100%',
    height: 19,
    lineHeight: 19,
    marginBottom: 2,
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  sDesc: {
    width: '100%',
    height: 15,
    lineHeight: 15,
    fontSize: 12,
    color: '#FF3517',
    textAlign: 'center',
  },

  soldOut: {
    position: 'absolute',
    left: 15,
    top: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  soldOutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: BaseStyleSheet.FontWeight.Bold,
  }
})
