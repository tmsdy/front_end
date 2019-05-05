/**
 * Created by kerwinliu on 2018/6/8.
 */
/*
* 新手引导弹框
* */
import React,{PureComponent} from 'react'
import {
    StyleSheet,
    TouchableOpacity
}from 'react-native'
import {
    View,
    Image,
    Modal
}from '@iqiyi/rn-ui'
import {Width,Height} from '@iqiyi/rn-utils'
import WebImage from './WebImage'
export default class extends PureComponent{
    constructor(props){
        super(props)
        this.state = {
            visible :true
        }
    }
    close =()=>{
        this.setState({
            visible : false
        })
    }
    render(){
        const { visible } = this.state
        return(
            <Modal
                isVisible={visible}
                transparent={true}
                pressFeedBack={this.close}
            >
                <View style={{width:Width,height:Height}}>
                    <TouchableOpacity style={{width:Width,height:Height}} onPress={this.close} activeOpacity={1}/>
                    <View style={{width:349,height:201,position:'absolute',top:182,left:13}} pointerEvents={'box-none'}>
                        <WebImage name='home_guide' style={{width:349,height:201}}/>
                    </View>
                </View>
            </Modal>
        )
    }
}