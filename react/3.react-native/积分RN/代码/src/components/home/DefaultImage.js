/**
 * Created by kerwinliu on 2018/7/9.
 */
import React, {Component} from 'react'
import {Image, View} from '@iqiyi/rn-ui'
import WebImage from '../WebImage'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false
    }
  }

  render() {
    const {error} = this.state
    const {style, errorImageStyle, source} = this.props
    return (
      <React.Fragment>
        {
          !error
            ? (
              <Image
                source={{uri: source}}
                style={[{
                  backgroundColor: 'transparent',
                  borderRadius: 3
                }, style]}
                onError={() => {
                  this.setState({error: true})
                }}
              />
            )
            : (
              <View
                style={[style, {
                  backgroundColor: '#f9f9f9',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 3
                }]}
              >
                <WebImage name="img_default" style={errorImageStyle}/>
              </View>
            )
        }
      </React.Fragment>
    )
  }
}
