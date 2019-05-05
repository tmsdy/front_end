/**
 * 商品兑换Modal
 */
import React, {PureComponent} from 'react';
import {View, Text} from '@iqiyi/rn-ui'
import PropTypes from 'prop-types';
import ReduxUtil from '../../common/ReduxUtil';
import LottieAnimation from '../LottieAnimation'
import ConfirmModal from '../ConfirmModal'


export default class ConvertLoading extends PureComponent {
    static propTypes = {
        modalVisible: PropTypes.bool, // 兑换loading是否显示
        convertSuscessText: PropTypes.string, // 兑换成功显示的文案
        convertLoadingText: PropTypes.string, // 兑换中以及兑换成功之后loading文案
      };
      static defaultProps = {
        convertSuscessText: '',
        convertLoadingText: '正在为您兑换...',
      };
    constructor(props) {
        super(props);
        this.refSuccess = ReduxUtil.createRef()
    }
    componentDidMount() {
        this.refSuccess.getInstance().then(ref => ref.play())
    }
    // props更新时
    componentDidUpdate() {
        this.refSuccess.getInstance().then(ref => ref.play())
    }
    render() {
        const {modalVisible, convertLoadingText, convertSuscessText} = this.props
        return (
            <ConfirmModal modalVisible={modalVisible} isTransparent={true}>
                <View style={styles.convertWrap}>
                    <View style={styles.lottie}>
                        <LottieAnimation
                          ref={this.refSuccess}
                          style={{width: 60, height: 60}}
                          remote={true}
                          name="convert_lottie"
                          onAnimationEnd={this.onAnimationEnd}
                          loop={true}
                        />
                    </View>
                    <View style={styles.textWrap}>
                        {
                            convertSuscessText ? <Text style={styles.convertSuscess}>{convertSuscessText}</Text> : null
                        }
                        <Text style={styles.text}>{convertLoadingText}</Text>
                    </View>
                </View>
            </ConfirmModal>
        );
    }

    onAnimationEnd = () => {
        this.props.onSuccessActiveEnd && this.props.onSuccessActiveEnd()
    }
}

const styles = BaseStyleSheet.create({
    convertWrap: {
        width: 230,
        height: 160,
        backgroundColor: '#000000',
        opacity: 0.7,
        borderRadius: 10,
        alignItems: 'center',
    },
    lottie: {
        marginTop: 10
    },
    textWrap: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    convertSuscess: {
        fontFamily: 'PingFangSC-Medium',
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 22,
    },
    text: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 5
    }
});
