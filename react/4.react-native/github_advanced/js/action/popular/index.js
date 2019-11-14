import Types from '../types'
import DataStore,{FLAG_STORAGE} from '../../expend/dao/DataStore'
import {handleData} from '../ActionUtil'

export function onRefreshPopular(storeName,url,pageSize) {
    return dispatch => {
        dispatch({
            type: Types.POPULAR_REFRESH,
            storeName, //前端后端那些分类名
        })
        let dataStore = new DataStore()
        dataStore.fetchData(url,FLAG_STORAGE.flag_popular)
            .then(data => {
                // console.log(data)
                handleData(Types.POPULAR_REFRESH_SUCCESS,dispatch,storeName,data,pageSize)
            })
            .catch(err=>{
                console.log(err)
                dispatch({
                    type: Types.LOAD_POPULAR_FAIL,
                    storeName,
                    err
                })
            })
    }
}
/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @param favoriteDao
 * @returns {function(*)}
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callBack) {
    return dispatch => {
        setTimeout(()=>{ //模拟网络请求
            if((pageIndex-1)*pageSize>=dataArray.length){ //已加载完全部数据
                if(typeof callBack === 'function'){
                    callBack('no more data')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName,
                    pageIndex: --pageIndex,
                })
            }else{
                let max = pageIndex*pageSize > dataArray.length ? dataArray.length : pageIndex*pageSize
                // console.log(pageIndex,pageSize,max)
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels: dataArray.slice(0,max)
                })
            }
        },100)
    }
}
