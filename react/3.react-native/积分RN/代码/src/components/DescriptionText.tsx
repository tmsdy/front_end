/**
 * Created by liuzhimeng.
 * @date 2019-04-20
 * @description 描述文案组件
 */

import React, {PureComponent} from 'react'

import {View, Text} from '@iqiyi/rn-ui'
import BaseStyleSheet, {ViewStyle, TextStyle} from '../common/BaseStyleSheet'

type descriptionText = string | `^hl|.+` | `^tag|.+`

interface DescriptionItem {
  readonly id: string;
  text: descriptionText;
}

interface DescriptionTextProps {
  data: string | DescriptionItem[];
  constainerStyle?: ViewStyle;
  defaultStyle?: TextStyle;
  highlightStyle?: TextStyle;
  tagStyle?: TextStyle;
}

export default class DescriptionText extends PureComponent<DescriptionTextProps, {}> {
  render() {
    const {data = null, constainerStyle = {}, highlightStyle = {}, tagStyle = {}} = this.props

    if(!data) return null

    if(typeof data === 'string') {
      return this.renderDefault(data)
    }

    return (
      <View style={[styles.container, constainerStyle]}>
        {data.map(({id, text}) => {
          if(/^hl\|/.test(text)) {
            return <Text key={id} style={[styles.highlight, highlightStyle]}>{text.slice(3)}</Text>
          }
          if(/^tag\|/.test(text)) {
            return (
              <View key={id} style={styles.tagWrapper}>
                <Text style={[styles.tag, tagStyle]}>{text.slice(4)}</Text>
              </View>
            )
          }
          return this.renderDefault(text, {key: id})
        })}
      </View>
    )
  }

  renderDefault = (text: string, textProps = {}) => {
    return <Text style={[styles.defaultText, this.props.defaultStyle]} {...textProps}>{text}</Text>
  }

}

const styles = BaseStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 19,
  },
  defaultText: {
    fontSize: 12,
    color: '#999999',
  },
  highlight: {
    color: '#FF8A1F',
  },
  tagWrapper: {
    height: 13,
    marginHorizontal: 2,
    paddingHorizontal: 5,
    borderRadius: 7,
    backgroundColor: '#FFEEEA',
  },
  tag: {
    lineHeight: 13,
    height: 13,
    color: '#FF410F',
    fontSize: 9,
  },
})
