/**
 * 根据 device pixel ratio 加载 web 图片
 */

import React, {PureComponent} from 'react'
import {Animated, ImageProperties} from 'react-native'
import {Image} from '@iqiyi/rn-ui'

import {ImageStyle} from '../common/BaseStyleSheet'

import {getCDNUrl} from '../constants/configs'
import {isURL} from '../common/util'

/**
 * 获取Image组件的uri值
 * @param name 指定cdn图片名，可以是http的绝对地址
 * @param uri 直接指定Image的uri值
 */
const getUri = (name: string, uri?: string): string => {
  if(uri) {
    return uri
  }
  return isURL(name) ? name : getCDNUrl(name)
}

export interface WebImageProps {
  name?: string;
  uri?: string;
  resizeMode?: ImageProperties['resizeMode'];
  [propName: string]: any;
}

export default function WebImage({name, uri, resizeMode = 'cover', ...leftProps}: WebImageProps) {
  const _uri = getUri(name, uri)
  return <Image source={{uri: _uri}} resizeMode={resizeMode} {...leftProps}/>
}

// AnimatedWebImage，扩展WebImage接口到Animated.Image组件
export function AnimatedWebImage({name, uri, ...left}: WebImageProps) {
  const _uri = getUri(name, uri)
  return <Animated.Image source={{uri: _uri}} {...left}/>
}

interface DefaultImageProps extends WebImageProps {
  defaultImage?: string;
  defaultImageStyle?: ImageStyle;
}
interface DefaultImageState {
  status: boolean;
}
// DefaultImage，带有默认图片的WebImage
export class DefaultImage extends PureComponent<DefaultImageProps, DefaultImageState> {
  private showDefault: boolean;

  static defaultProps = {
    defaultImage: '',
    defaultImageStyle: {},
  }

  constructor(props: DefaultImageProps) {
    super(props)

    this.state = {
      status: false
    }

    this.showDefault = false
  }

  render() {
    const {defaultImage, defaultImageStyle, style, name, ...left} = this.props
    const imageName = this.state.status && defaultImage ? defaultImage : name

    return (
      <WebImage
        {...left}
        name={imageName}
        onError={this.onError}
        style={[style, defaultImageStyle]}
      />
    )
  }

  onError = () => {
    // 仅执行一次，否则可能会导致死循环
    if(!this.showDefault) {
      this.showDefault = true
      this.setState({status: true})
    }
  }
}
