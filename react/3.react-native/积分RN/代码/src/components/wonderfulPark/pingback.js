/**
 * Created by liuzhimeng.
 * @date 2018-12-28
 * @description
 */

export const PARK_PAGE = 'paradise'

export const SIGN_MODAL_BLOCK = '296000'
export const ADV_MODAL_BLOCK = '296001'
export const SEED_MODAL_BLOCK = '296002'
export const AUCTION_MODAL_BLOCK = '296003'
export const TOPIC_PK_BLOCK = '230000'
export const getTopciPkCardBlock = n => 230000 + n
export const SLOT_BLOCK = '270000'
export const HOT_EXCHANGE_BLOCK = '250000'
export const SNATCH_FIRST_TIME_BLOCK = '240001'
export const AUCTION_BLOCK = '296003'
export const SNATCH_BLOCK = '240000'
export const GAME_BLOCK = '296010'

export const INTEGRAL_DETAIL_CLICK = 'go_detailbtn'
export const MY_GAIN_CLICK = 'go_transpage'
export const GO_LOGIN_CLICK = 'go_login'
export const GO_FLOWER_MOVE_CLICK = 'go__flowerdown'
export const GO_FLOWER_CLICK_CLICK = 'go__flowerclick'
export const getBannerBlockPingback = n => `bnr_${n}`
export const GO_TASK_LIST_CLICK = 'go_pointcenter'
export const getTopicPkButtonCLickPingback = n => `topic${n}_carding`
export const getTopicPkCardCLickPingback = n => `topic${n}_card`
export const TOPIC_PK_MY_LIST_NOT_POINT_CLICK = 'topiccard_my'
export const TOPIC_PK_MY_LIST_HAVE_POINT_CLICK = 'topiccard_myget'
export const getSlotClickPingback = n => `zyzq_${n}`
export const getHotExchangeClickPingback = n => `hot_good${n}`
export const HOT_EXCHANGE_LOOK_MORE_CLICK = 'hotgd_more'
export const AUCTION_CLICK = 'goauction'
export const SNATCH_FIRST_MODAL_CLICK = 'duobao_onemore'
export const getOrderClickPingback = n => `carddb_open${n}`
export const getCancelOrderClickPingback = n => `carddb_close${n}`
export const getSnatchClickPingback = n => `carddb${n}`
export const getSnatchDetailClickPingback = n => `carddbs${n}`
export const SNATCH_LOOK_MORE_CLICK = 'db_more'
export const SNATCH_LOOK_MORE_WITH_NOTICE_CLICK = 'db_morered'
export const getGameClickPingback = n => `game_${n}`
