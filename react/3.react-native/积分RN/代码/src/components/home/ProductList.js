/**
 * Created by kerwinliu on 2018/7/2.
 */
/*
* 道具后台数据  低价会员， 礼包专区
* */
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { isIOS } from '@iqiyi/rn-utils'
import { executeTask, } from '../../api'
import CardList from './CardList'
import {getDaojuByPagination} from '../../components/home/GetData'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allData: [],
            allCode: this.props.allCode
        }
    }
    componentDidMount() {
        this._getData()
    }
    getDaojuQudaoCode = () => {
       const {allCode} = this.state
       const listCode = allCode.slice(1, allCode.length)
       listCode.map((item, index) => {
           return (
            getDaojuByPagination({size: 3, page: 1, partnerCode: item.partnerCode}).then((result) => {
                if (result && result.length) {
                    const {allData} = this.state
                    allData[index] = result;
                    const temp = [].concat(allData)
                    this.setState({
                        allData: temp
                    })
                }
             })
           )
            // return this._getDaojuItems(item.partnerCode, index)
       })

    }
    _getData = () => {
        this.getDaojuQudaoCode()
    }
    _getDaojuItems = (key, index) => {
        const requestBody = {
            daojuProductList: {
                vertical_code: 'iQIYI',
                partner_code: key,
                platform: isIOS ? '2_22_221' : '2_22_222',
                need_ext: true,
                user_id: global.USER_INFO.userId
            }
        }

        const requestHeader = {
            task_code: 'daojuProductList',
            timestamp: Date.now(),
        }

        return executeTask(requestHeader, requestBody).then((data) => {
            if (data.code === 'A00000') {
                const {allData} = this.state
                allData[index] = data.data;
                const temp = [].concat(allData)
                this.setState({
                    allData: temp
                })
            }
        }).catch(err => Promise.reject(err))
    }

    render() {
        const { allData} = this.state
        if (!allData.length) {
            return null
        }
        return (
            <React.Fragment>
                {allData.map((itemList, index) => {
                    if (itemList.length) {
                        return (<CardList
                                    key={index}
                                    index={index}
                                    allCode={this.props.allCode}
                                    list={itemList} {...this.props}
                                />)
                    }
                    return null
                })}
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({

})
