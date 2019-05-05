/**
 * 签到动效
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View} from '@iqiyi/rn-ui';
import Animation from '@iqiyi/rn-lottie'
import {CDN_URL} from '../../constants/configs';

export default class SignAnimation extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        const jsonUrl = `${CDN_URL}json/signAni.zip`
        if(jsonUrl) {
            return (
                <View style={styles.wrapper}>
                    <View>
                        <Animation
                          ref={(el) => { this._play(el) }}
                          style={{width: 240, height: 290}}
                          url={jsonUrl}
                          loop={false}
                        />
                    </View>
                </View>
            )
        }
        return (
            <View/>
        )
    }
    _play = (el) => {
        el && el.play()
    }
}
const styles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
