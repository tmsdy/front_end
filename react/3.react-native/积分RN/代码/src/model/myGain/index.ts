
import {
    OrderListState,
    OrderItem
} from '../../typings/apis/myGain'
import {getOrderList, getOrderDetail} from '../../api'
import {
    getNewContents,
    handelDetailRes,
    getNewAddressInfo,
    getDialogContentField
} from './options'

const verticalCode = 'iQIYI'

const TASK_CODE = {
    OrderList: 'daojuUserOrders',
    OrderDetail:'daojuOrderStatusQuery'
  }

export const fetchUserOrders = async (state: OrderListState): Promise<OrderListState> => {
    let resData: OrderListState
    let {page, size, productStatus, isRefresh, orderList} = state
    let loadMore = false
    try {
        const requestHeader = {
            task_code: TASK_CODE.OrderList,
            timestamp: Date.now()
        }
        const requestBody = {
            daojuUserOrders: {
              vertical_code: verticalCode,
              user_id: global.USER_INFO.userId,
              size,
              page,
              tag: '兑换记录',
              product_status: productStatus
            }
          }
        const {data: {code = '', data = {}} = {}} = await getOrderList({requestHeader, requestBody})
        const newContents = getNewContents(data)
        const newOrderList = isRefresh ? [...newContents] : [...orderList, ...newContents]
        if(data.size < size) {
            loadMore = false
        } else {
            loadMore = data.total > newOrderList.length
        }
        // 是否为空页面
        const isEmpty = newOrderList.length === 0
        // baseState
        const baseState = {
            orderList: newOrderList as [OrderItem],
            isEmpty,
            loaded: false,
            isRefresh: false,
            pullRefresh: false,
            loadMore: false
        }
        resData = code === 'A00000'
          ? {
              page: page === 1 ? page : page - 1,
              ...baseState
            }
          : {
              page: page === 1 ? page : page - 1,
              ...baseState,
              loadMore
            }
        return resData
      } catch(e) {
        return resData
      }
}

export const fetchOrderDetail = async (item: OrderItem): Promise<OrderListState> => {
    let resData: OrderListState
    let {orderCode, productId} = item
    try {
        const requestHeader = {
            task_code: TASK_CODE.OrderDetail,
            timestamp: Date.now()
        }
        const requestBody = {
            daojuOrderStatusQuery: {
                order_code: orderCode
            }
        }
        const detailRes = await getOrderDetail({requestHeader, requestBody})
        // 返回当前详情信息
        const orderDetailInfo = handelDetailRes(detailRes, productId)
        const {addressInfo} = orderDetailInfo
        // 获取新的地址信息
        const newAddressInfo = addressInfo && getNewAddressInfo(addressInfo)
        // 新的订单详情字段
        const newOrderDetailInfo = {
            ...item,
            rules: orderDetailInfo.rules,
            redeemCodes: orderDetailInfo.redeemCodes,
            newAddressInfo
        }
        // 获取展示弹框内容,弹框中的字段统一从该方法中获取
        const newDialogContent = getDialogContentField(newOrderDetailInfo)
        resData = {
            showOrderDetailDialog: true,
            orderDetailInfo: {
                ...newOrderDetailInfo,
                newDialogContent
            }
        }

        return resData
    } catch{
        return resData
    }
}
