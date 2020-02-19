import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, PanResponder, TouchableOpacity, NativeEventEmitter } from 'react-native'
import { px2dp, SCREEN_WIDTH, SCREEN_HEIGHT } from '~/libs/utils'
import { FollowInfo } from '../type'
import { BaseURL, uploadUrl, downloadBaseUrl } from '~/libs/config'
import { formatFileSize } from '~/libs/tools'
import Api from '~/libs/api'
import Sound from 'react-native-sound'
import Mime from 'mime'
import RNFS from 'react-native-fs';
import axios from 'axios'
import http from '~/libs/http'
import queryString from 'query-string'
import MyIcons from '~/Icon'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import { Modal, Toast } from '@ant-design/react-native'
import { Recognizer, Synthesizer, SpeechConstant } from "react-native-speech-iflytek";

interface Props {
    getData: (params: FollowInfo) => void
}

interface State {
    hasPermission: any,
    audioPath: string,
    recording: boolean,
    stop: boolean,
    currentTime: number,
    showYuyinModal: boolean,
    voicing: boolean, // 是不是正在说话
    yuyinVal: string, // 语音的输入框
}

export default class TrackContent extends Component<Props, State> {
    _panResponder: any
    recognizerEventEmitter: any
    state: State = {
        hasPermission: undefined, //授权状态
        audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac', // 文件路径
        recording: false, //是否录音
        stop: false, //录音是否停止
        currentTime: 0, //录音时长
        showYuyinModal: false,
        voicing: false,
        yuyinVal: ''
    }
    constructor(props: Props) {
        super(props)
    }

    componentWillMount() {
        Recognizer.init("5e153225");
        this.recognizerEventEmitter = new NativeEventEmitter(Recognizer);
        this.recognizerEventEmitter.addListener('onRecognizerResult', this.onRecognizerResult);
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                console.log('onPanResponderGrant')
                Recognizer.start()
                this.setState({
                    voicing: true
                })
                this._record()
            },
            onPanResponderRelease: (evt, gestureState) => {
                Recognizer.stop()
                this.setState({
                    voicing: false
                })
                this._stop()
            },
        })
    }

    onRecognizerResult(e) {
        console.log('onRecognizerResult=', e)
    }

    componentDidMount() {
        console.log(Mime.getType('aac'))
        // 请求授权
        AudioRecorder.requestAuthorization()
            .then((isAuthor: boolean) => {
                if (!isAuthor) {
                    return console.log('请前往设置开启录音权限')
                }
                this.setState({ hasPermission: isAuthor })
                this.prepareRecordingPath(this.state.audioPath);
                // 录音进展
                AudioRecorder.onProgress = (data) => {
                    this.setState({ currentTime: Math.floor(data.currentTime) });
                };
                // 完成录音
                AudioRecorder.onFinished = (data) => {
                    // data 返回需要上传到后台的录音数据
                    console.log(this.state.audioPath)
                    console.log(data)
                    RNFS.readDir(AudioUtils.DocumentDirectoryPath)
                        .then(res => {
                            let luyinFile = Array.isArray(res) ? res.find(item => item.name === 'test.aac') : null
                            console.log(luyinFile)
                            RNFS.readFile(AudioUtils.DocumentDirectoryPath + '/test.aac', 'base64')
                                .then(base64 => {
                                    if (luyinFile) {
                                        this.uploadLuyin({ ...luyinFile, base64 })
                                    }
                                })
                            // if (luyinFile) {
                            //     this.uploadLuyin({ ...luyinFile, base64: data.base64 })
                            // }
                        })

                    // this.uploadLuyin(data)
                };
            })
    }

    uploadLuyin(luyinFile) {
        let requestOptions = {
            // data: {
            format: "amr",//格式支持pcm（不压缩）、wav（不压缩，pcm编码）、amr（压缩格式）采样率
            rate: 8000,// 文档参数16000，但达不到这种高保真音频，故 使用8000
            dev_pid: 1536,//普通话
            channel: 1,//固定写法（声道）
            cuid: "862245234377502,862989243244150",//设备的唯一id
            token: '24.de770927b0fc1f1cb842cad6a0822719.2592000.1580622578.282335-18165189',//获取到的token值
            len: luyinFile.size,//文件的大小，字节数
            speech: luyinFile.base64,//base64的音频文件
            // }
        }
        // 'audio/x-aac'
        // http.post('http://vop.baidu.com/server_api', requestOptions)
        axios.post(BaseURL + Api.client.yuyinShibie.client_yuyinShibie, requestOptions)
            // axios.post(BaseURL + Api.client.yuyinShibie.client_yuyinShibie, luyinFile)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })

        let formData = new FormData()
        // formData.append('file', {
        //     uri: audioFileURL,
        //     type: 'audio/x-aac',
        //     name: 'test.aac',
        //     size: fileLength
        // })
        // console.log('开始上传')
        // axios({
        //     url: uploadUrl,
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     data: formData,
        // }).then(res => {
        //     console.log('res==', res)
        //     console.log(downloadBaseUrl + res.data.data)
        // }).catch(err => {
        //     console.log('err=', err)
        // })
    }

    yuyinShibie = async () => {
        let { audioPath } = this.state
        console.log('yuyinShibie', audioPath)
        axios.post(BaseURL + Api.client.yuyinShibie.client_yuyinShibie)
            .then(res => {
                console.log('res=', res)
            })
        // RNFS.readFile(audioPath)
        //     .then(res => {
        //         console.log(res)
        //     }).catch(err => {
        //         console.log(err)
        //     })
    }

    prepareRecordingPath = (path) => {
        const option = {
            SampleRate: 44100.0, //采样率
            Channels: 1, //通道
            AudioQuality: 'Medium', //音质
            AudioEncoding: 'aac', //音频编码（aac编码iOS和Android均支持）
            OutputFormat: 'mpeg_4', //输出格式
            MeteringEnabled: false, //是否计量
            MeasurementMode: false, //测量模式
            AudioEncodingBitRate: 32000, //音频编码比特率
            IncludeBase64: true, //是否是base64格式
            AudioSource: 0, //音频源
        }
        AudioRecorder.prepareRecordingAtPath(path, option)
    }

    // 开始录音
    _record = async () => {
        let { hasPermission, recording, stop, audioPath } = this.state
        if (!hasPermission) {
            Toast.fail('录音没有被授权')
        }
        if (recording) {
            return console.log('正在录音中...')
        }
        if (stop) {
            this.prepareRecordingPath(audioPath)
        }
        this.setState({ recording: true })

        try {
            await AudioRecorder.startRecording()
        } catch (err) {
            console.log(err)
        }
    }

    // 停止录音
    _stop = async () => {
        this.setState({ stop: true, recording: false });
        try {
            await AudioRecorder.stopRecording();
        } catch (error) {
            console.error(error);
        }
    }

    // 播放录音
    _play = async () => {
        let whoosh = new Sound(this.state.audioPath, '', (err) => {
            if (err) {
                return console.log(err)
            }
            whoosh.play(success => {
                if (success) {
                    console.log('success - 播放成功')
                } else {
                    console.log('fail - 播放失败')
                }
            })
        })
    }

    openYuyinModal = () => {
        // axios.get('https://openapi.baidu.com/oauth/2.0/token', {
        //     params: {
        //         grant_type: "client_credentials",
        //         client_id: "LCzuVbLQA0NFQYmw7xLLsRNH",
        //         client_secret: "vMSP1ASHG4GdxrNFr8lLprMszgDXc4RG"
        //     }
        // }).then(res => {
        //     console.log(res)
        // }).catch(err => {
        //     console.log(err)
        // })
        this.setState({
            showYuyinModal: true
        })
    }

    onYuyinValChange = (text: string) => {
        this.setState({
            yuyinVal: text
        })
    }

    addContent = () => {
        console.log('addContent')
    }

    componentWillUnmount() {
        this.recognizerEventEmitter.addListener('onRecognizerResult', this.onRecognizerResult);
    }

    render() {
        let { recording, currentTime, showYuyinModal, voicing, yuyinVal } = this.state
        // console.log(this._panResponder)
        return (
            <View style={styles.container}>
                <TextInput style={styles.contentInput} placeholder="请输入跟进内容或语音输入" multiline />
                <View style={styles.yuyinRow}>
                    <MyIcons style={styles.yuyinIcon} name="yuyin" onPress={this.openYuyinModal} />
                </View>
                <Text style={{ fontSize: px2dp(30) }} onPress={this.yuyinShibie}>语音识别</Text>
                <Text style={{ fontSize: px2dp(30) }} onPress={this._play}>播放</Text>
                <Modal
                    style={styles.yuyinModal}
                    popup
                    maskClosable
                    visible={showYuyinModal}
                    animationType="slide-up"
                    onClose={() => { this.setState({ showYuyinModal: false }) }}
                >
                    <TextInput style={styles.yuyinInput} multiline placeholder="按住下方语音按钮说话" value={yuyinVal} onChangeText={this.onYuyinValChange} />
                    <View style={styles.yuyinControl} >
                        {
                            yuyinVal ? <Text style={styles.black16} onPress={() => {
                                this.setState({ yuyinVal: '' })
                            }}>清空</Text> : <Text style={styles.arrowBottom} onPress={() => {
                                this.setState({ showYuyinModal: false })
                            }}></Text>
                        }

                        <View {...this._panResponder.panHandlers} style={styles.yuyinWrapper}>
                            <MyIcons style={voicing ? { ...styles.test, color: 'pink' } : styles.test} name="yuyin" />
                        </View>
                        {
                            yuyinVal ? <Text style={styles.black16} onPress={this.addContent}>确定</Text> : <View style={styles.whiteSpace}></View>
                        }

                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    test: {
        fontSize: px2dp(60)
    },
    container: {
        paddingLeft: px2dp(8),
        paddingRight: px2dp(8),
        paddingTop: px2dp(6),
        paddingBottom: px2dp(12),
        minHeight: px2dp(200),
        backgroundColor: '#f5f5f5',
        flexDirection: 'column'
    },
    yuyinRow: {

    },
    contentInput: {
        flex: 1,
        textAlignVertical: 'top'
    },
    text: {
        fontSize: 18,
        marginVertical: 10,
    },
    yuyinIcon: {
        fontSize: px2dp(30),
        marginLeft: 'auto'
    },
    yuyinModal: {
        height: px2dp(260),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12),
        paddingTop: px2dp(6),
        paddingBottom: px2dp(14),
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    yuyinWrapper: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    yuyinControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    yuyinInput: {
        minHeight: px2dp(160),
        fontSize: px2dp(16),
        textAlignVertical: 'top'
    },
    black16: {
        fontSize: px2dp(16),
        color: '#303133',
    },
    arrowBottom: {
        width: 16,
        height: 16,
        marginLeft: px2dp(6),
        borderColor: '#B6BAC6',
        borderBottomWidth: 2,
        borderRightWidth: 2,
        transform: [{ rotate: '45deg' }]
    },
    whiteSpace: {
        width: px2dp(22),
        height: px2dp(30)
    }
})