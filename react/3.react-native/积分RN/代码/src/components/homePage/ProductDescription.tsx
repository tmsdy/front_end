/**
 * Created by liuzhimeng.
 * @date 2019-04-25
 * @description 积分中心商品描述信息组件
 */

import React from 'react'
import DescriptionText from '../DescriptionText'

export interface ProductDescriptionProps {
  score: number;
  price?: number;
  originalPrice?: number;
  originalPriceUnit?: '积分' | '元';
  disabled?: boolean;
}

const getDescData = ({
  score = null,
  price = null,
  originalPrice = null,
  originalPriceUnit = '积分',
}: ProductDescriptionProps): any[] => {
  const list = []

  const current = price ? `${score}积分+${price}元` : `${score}积分`
  list.push({id: 'id1', text: current})

  if(originalPrice) {
    list.push({id: 'id2', text: `hl|${originalPrice}${originalPriceUnit}`})
  }

  return list
}

export default function ProductDescription(props: ProductDescriptionProps) {
  const opacity = props.disabled ? 0.5 : 1

  return (
    <DescriptionText
      data={getDescData(props)}
      constainerStyle={{
        justifyContent: 'center',
        height: 15,
      }}
      defaultStyle={{
        color: '#FF3517',
        opacity,
      }}
      highlightStyle={{
        marginLeft: 2,
        fontSize: 12,
        color: '#999999',
        opacity,
        textDecorationLine: 'line-through',
        textDecorationColor: '#999999',
        textDecorationStyle: 'solid',
      }}
    />
  )
}
