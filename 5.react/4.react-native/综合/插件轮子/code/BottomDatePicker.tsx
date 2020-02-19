import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../libs/utils'
import { DatePickerView } from "@ant-design/react-native"


interface DatePickerProps {
    title?: string,
    setMaskOff: (off: boolean) => void //设置组件显隐状态方法
    getDate: (date: Date) => void, //点确定获取时间的方法
}
interface DatePickerState {
    dateVal: Date
}

export default class BottomDatePicker extends Component<DatePickerProps, DatePickerState> {
    public state: DatePickerState = {
        dateVal: new Date,
    }

    constructor(props: DatePickerProps) {
        super(props)
    }

    componentDidMount() {
    }

    onChange(value: Date) {
        this.setState({
            dateVal: value
        })
    }

    comfirmDate() {
        let { getDate, setMaskOff } = this.props
        getDate(this.state.dateVal)
        setMaskOff(false)
    }

    render() {
        let { setMaskOff, title } = this.props
        let { dateVal } = this.state
        return (
            <View style={styles.Wrapper}>
                <TouchableOpacity style={styles.mask} onPress={() => {
                    setMaskOff(false)
                }} />
                <View style={styles.bottomBox}>
                    <View style={styles.datePickerRow}>
                        <Text style={[styles.black16, styles.marginLeft16]} onPress={() => {
                            setMaskOff(false)
                        }}>取消</Text>
                        <Text style={styles.black13}>{title || '日期选择'}</Text>
                        <Text style={[styles.black16, styles.marginRight16]} onPress={this.comfirmDate.bind(this)}>确定</Text>
                    </View>
                    <DatePickerView
                        value={dateVal}
                        mode='datetime'
                        onChange={this.onChange.bind(this)}
                    ></DatePickerView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    Wrapper: {
        position: 'absolute',
        bottom: 0,
        zIndex: 300,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    mask: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    bottomBox: {
        width: SCREEN_WIDTH,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    datePickerRow: {
        width: SCREEN_WIDTH,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    black13: {
        textAlign: 'right',
        fontSize: 13,
        color: '#606266',
    },
    black16: {
        color: '#303133',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 22
    },
    marginLeft16: {
        marginLeft: 16
    },
    marginRight16: {
        marginRight: 16
    },
})