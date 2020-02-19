import Types from '../types'
import DataStore,{FLAG_STORAGE} from '../../expend/dao/DataStore'
import {handleData} from '../ActionUtil'

export function onRefreshTrending(storeName,url,pageSize) {
    return dispatch => {
        dispatch({
            type: Types.TRENDING_REFRESH,
            storeName, //前端后端那些分类名
        })
        let dataStore = new DataStore()
        dataStore.fetchData(url,FLAG_STORAGE.flag_trending)
            .then(data => {
                // console.log(data)
                handleData(Types.TRENDING_REFRESH_SUCCESS ,dispatch,storeName,data,pageSize)
            })
            .catch(err=>{
                console.log(err)
                dispatch({
                    type: Types.TRENDING_REFRESH_FAIL,
                    storeName,
                    err
                })
            })
    }
}

export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], callBack) {
    return dispatch => {
        setTimeout(()=>{ //模拟网络请求
            if((pageIndex-1)*pageSize>=dataArray.length){ //已加载完全部数据
                if(typeof callBack === 'function'){
                    callBack('no more data')
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName,
                    pageIndex: --pageIndex,
                })
            }else{
                let max = pageIndex*pageSize > dataArray.length ? dataArray.length : pageIndex*pageSize
                // console.log(pageIndex,pageSize,max)
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels: dataArray.slice(0,max)
                })
            }
        },100)
    }
}
