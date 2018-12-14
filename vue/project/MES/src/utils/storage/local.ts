import engine from 'store/src/store-engine'
// @ts-ignore
import storage from 'store/storages/localStorage'
import expire from 'store/plugins/expire'

export default engine.createStore(storage, [expire])
