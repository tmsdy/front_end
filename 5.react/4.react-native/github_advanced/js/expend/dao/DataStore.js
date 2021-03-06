import { AsyncStorage } from 'react-native';
// import Trending from 'GitHubTrending'

export const FLAG_STORAGE = {
    flag_popular: 'popular',
    flag_trending: 'trending'
};

export default class DataStore {

    /**
     * 获取数据，优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
     * @param url
     * @param flag
     * @returns {Promise}
     */
    fetchData(url, flag) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url).then((wrapData) => {
                console.log('wrapData=', wrapData)
                if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                    console.log('走本地缓存了')
                    resolve(wrapData);
                } else {
                    console.log('走请求了')
                    this.fetchNetData(url, flag).then((data) => {
                        resolve(this._wrapData(data));
                    }).catch((error) => {
                        reject(error);
                    })
                }

            }).catch((error) => {
                this.fetchNetData(url, flag).then((data) => {
                    resolve(this._wrapData(data));
                }).catch((error => {
                    reject(error);
                }))
            })
        })
    }

    fetchLocalData(url) { //获取本地数据
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) { //保存的是非json的会报错
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    fetchNetData(url, flag) { //从网络获取数据
        return new Promise((resolve, reject) => {
            if (flag !== FLAG_STORAGE.flag_trending) {
                console.log('popuplar')
                fetch(url)
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Network response was not ok.');
                    })
                    .then((responseData) => {
                        this.saveData(url, responseData)
                        resolve(responseData);
                    })
                    .catch((error) => {
                        reject(error);
                    })
            } else {
                console.log('flag_trending')
                // new Trending().fetchTrending(url)
                //     .then(items => {
                //         if (!items) {
                //             throw new Error('responseData is null');
                //         }
                //         this.saveData(url, items);
                //         resolve(items);
                //     })
                //     .catch(error => {
                //         reject(error);
                //     })
            }
        })
    }

    saveData(url, data, callback) {
        if (!data || !url) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
    }

    _wrapData(data) { //给data打上时间戳
        return { data: data, timestamp: new Date().getTime() };
    }

    /**
     * 检查timestamp是否在有效期内
     * @param timestamp 项目更新时间
     * @return {boolean} true 不需要更新,false需要更新
     */
    static checkTimestampValid(timestamp) {
        const currentDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;//有效期4个小时
        // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
        return true;
    }

}