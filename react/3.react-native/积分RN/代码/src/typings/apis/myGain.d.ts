
export interface OrderDetailInfo{ // 订单详情信息
    newUrl: string;
    name: string;
    rules: string;
    isCommodityExpired: boolean; // 商品是否过期
    btnType: number;
    newToUseLink: string;
    redeemCodes: string;
    productId: number;
    orderCode: string;
    newProductSource: any;
    type: string;
    subType: number;
    newDialogContent?: any;
}

export interface OrderItem extends OrderDetailInfo{ // 每个商品信息
    newUrl: string;
    btnText: string;
    timeStatusText: string;
    validTime: string;
    name: string;
    newPartnerSwitchInfo: {
        switchAddress: string;
        nickname: string;
    };
    productStatus: number;
    formatUseTime: number;
    isCommodityExpired: boolean;
    productId: number;
    orderCode: string;
}

export interface OrderListState { // 商城我的收获
    isRefresh?: boolean;
    orderList?: [OrderItem];
    orderDetailInfo?: OrderDetailInfo;
    showOrderDetailDialog?: boolean; // 显示隐藏弹框的控制开关
    pullRefresh?: boolean;
    page?: number;
    size?: number;
    productStatus?: number;
    loadMore?: boolean;
    isEmpty?: boolean;
    loaded?: boolean;
}

export interface OrderListProps {
    productStatus: number;
    tabLabel: string;
    openWeb(url: string): any;
    goTo(url: string): any;
}
