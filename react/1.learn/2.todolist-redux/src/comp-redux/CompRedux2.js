export default () => {
    let state = {
        showOff: false
    }
    let _state = {
        currentType: '',
        resolve: null,
        reject: null,
        listeners: []
    }

    function _dispatch() {
        let current = _state.listeners.find(listener => listener.type === _state.currentType)
        if (current) {
            current.listener(state)
        }
    }

    function _resetState() {
        state = {
            showOff: false
        }
        _dispatch()
    }

    function subscribe(type, listener) {
        _state.listeners.push({ type, listener })
    }

    function unsubscribe(type) {
        _state.listeners = _state.listeners.filter(item => item.type !== type)
    }

    function selectData(data) {
        _resetState()
        _state.resolve && _state.resolve({
            code: '0',
            data
        })
    }

    function showComp({ type }) {
        return new Promise((resolve, reject) => {
            Object.assign(state, { showOff: true })
            Object.assign(_state, { currentType: type, resolve, reject })
            _dispatch()
        })
    }

    function closeComp() {
        if (state.showOff) {
            _resetState()
            _state.reject && _state.reject({ code: '-1', message: '取消选择' })
        }
    }

    return {
        subscribe,
        unsubscribe,
        selectData,
        showComp,
        closeComp
    }
}