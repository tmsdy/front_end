import FindDetail_Customs from './FindDetail_Customs'
import FindDetail_Only from './FindDetail_Only'

import { getStore } from '@/libs/utils'

const isFindLite = (function() {
    let navigator = getStore('navigator') || { uRIs: [] }
    const uRIs = navigator.uRIs || []
    return uRIs.indexOf('/main/discovery/customsData') == -1
}())

const FindDetail = isFindLite ? FindDetail_Only : FindDetail_Customs

export default FindDetail
