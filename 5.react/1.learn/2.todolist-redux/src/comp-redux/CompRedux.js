
class CompRedux {

    constructor() {
        this.state = {
            showOff: false
        }
        this._state = {
            currentType: '',
            reject: null,
            resolve: null,
            listeners: []
        }
    }

    subscribe(compType, listener) { // 收集订阅的类型和更新时需要触发的回调
        this._state.listeners.push({
            type: compType,
            listener
        })
    }

    _dispatch() { // 触发监听回调
        let { currentType, listeners } = this._state
        let current = listeners.find(item => item.type === currentType)
        if (current) {
            current.listener(this.state)
        }
    }

    show({ type, params = {} }) {
        return new Promise((resolve, reject) => {
            Object.assign(this.state, { showOff: true }, params)
            Object.assign(this._state, { resolve, reject, currentType: type })
            this._dispatch()
        })
    }

    _resetState() {
        this.state = {
            showOff: false
        }
        this._dispatch()
    }

    select(data) {
        this._resetState()
        this._state.resolve && this._state.resolve({
            code: '0',
            data
        })
    }

    close() {
        if (this.state.showOff) {
            this._resetState()
            this._state.reject && this._state.reject({ code: '-1', message: '取消选择' })
        }
    }

    unsubscribe(compType) {
        this._state.listeners = this._state.listeners.filter(item => item.type !== compType)
    }

}

export default new CompRedux()
