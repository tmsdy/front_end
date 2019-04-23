
interface OrderListState {
    isRefresh: any;
    orderList: any[],
    orderDetailInfo: {
      newUrl:string,
      name:string,
      rules:string,
      isCommodityExpired:boolean
    },
    showOrderDetailDialog: boolean,
    pullRefresh: false,
    page: number,
    size: number,
    productStatus: number,
    loadMore: boolean,
    isEmpty: boolean,
    loaded: boolean
  }
  
  interface OrderListProps {
    productStatus:number
  }
  
  
  export default class OrderList extends Component<OrderListProps,OrderListState> {

    readonly state = {} as OrderListState


  }