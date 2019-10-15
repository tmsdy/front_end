import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { width, height } from '../../common/rn-utils';
import { DatePickerView } from "@ant-design/react-native";
import RootSiblings from 'react-native-root-siblings';

let sibling = undefined;

interface DatePickerProps {
  title?: string,
  getDate: (date: Date) => void, //点确定获取时间的方法
}
const defaultOptions = {
  title: '日期选择'
}
const BottomDatePicker = {
  showDatePicker: (options: DatePickerProps) => {
    let dateVal = new Date
    options = { ...defaultOptions, ...options }
    function onChange(value: Date) {
      // BottomDatePicker.dateVal = value
      dateVal = value
    }
    function comfirmDate() {
      options.getDate(dateVal)
      BottomDatePicker.hide()
    }
    sibling = new RootSiblings(
      <TouchableOpacity style={styles.mask} onPress={() => {
        BottomDatePicker.hide()
      }}>
        <View style={styles.bottomBox}>
          <View style={styles.datePickerRow}>
            <Text style={[styles.black16, styles.marginLeft16]} onPress={() => {
              BottomDatePicker.hide()
            }}>取消</Text>
            <Text style={styles.black13}>{options.title}</Text>
            <Text style={[styles.black16, styles.marginRight16]} onPress={comfirmDate}>确定</Text>
          </View>
          <DatePickerView
            value={dateVal}
            onChange={onChange}
          ></DatePickerView>
        </View>
      </TouchableOpacity>
    );
  },
  hide: () => {
    if (sibling instanceof RootSiblings) {
      sibling.destroy();
    }
  }
}
export default BottomDatePicker

let itemWidth = width - 32
const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    bottom: 0,
    zIndex: 222,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomBox: {
    width,
    position: 'absolute',
    left: 0,
    bottom: 0,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  datePickerRow: {
    width,
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