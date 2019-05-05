export interface SubmitItem {
  id: number;
  content: string;
  description: null|string;
  group: any;
  uid: number;
  ctime: number;
  utime: number;
  answerCount: number;
  status: number;
  order: number;
  verticalCode: string;
  typeCode: string;
  pic: null|string;
  wxaCode: null|string;
  jifenStatus: number;
  ip: string;
  type: string;
  scoreType: string;
  timeText: string;
}
export interface FetchMySubmitList {
  contentList: SubmitItem[];
  total: number;
  isEnd: boolean;
}
