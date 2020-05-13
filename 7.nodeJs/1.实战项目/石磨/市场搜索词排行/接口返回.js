let result1 = {
  hotList: [ // 搜索词 - 热搜
    {
      clickHits: 37198.954376438254, // 点击人气
      clickRate: 0.44508083853659697, // 点击率
      hotSearchRank: 1, // 热搜排行
      orderNum: 0,
      p4pRefPrice: 27.55125992919406,
      payRate: 0.011436089464629087, // 支付转化率
      seIpvUvHits: 77635.6906342452, // 搜索人气
      searchWord: '耐克官网旗舰',
      soarRank: 0, // 飙升排行
      tmClickRate: 0.9205990211897745
    },
    {
      clickHits: 33369.55908688356,
      clickRate: 0.5259496844660859,
      hotSearchRank: 2,
      orderNum: 0,
      p4pRefPrice: 43.5477191943128,
      payRate: 0.015090842324304474,
      seIpvUvHits: 73238.9386263211,
      searchWord: '耐克',
      soarRank: 0,
      tmClickRate: 0.8092826608523043
    },
    // ... 200 more items
  ],
  soarList: [ // 搜索词 - 飙升
    {
      clickHits: 12589.776329804017,
      clickRate: 1.1628125326007581,
      hotSearchRank: 0,
      orderNum: 0,
      p4pRefPrice: 0,
      payRate: 0.18415559772296014,
      seIpvUvHits: 13042.239913073394,
      seRiseRate: 47.90829694323144,
      searchWord: '996',
      soarRank: 1
    },
    {
      clickHits: 585.3119953352946,
      clickRate: 0.7304526748971193,
      hotSearchRank: 0,
      orderNum: 0,
      p4pRefPrice: 34,
      payRate: 0.030303030303030304,
      seIpvUvHits: 936.3058329004311,
      seRiseRate: 22.166666666666668,
      searchWord: '思凯奇男',
      soarRank: 2
    },
    // ... 200 more items
  ]
}

let result2 = {
  hotList: [ // 长尾词 - 热搜
    {
      clickHits: 25240.894972016307,
      clickRate: 0.43156607025083504,
      hotSearchRank: 1,
      p4pRefPrice: 57.366046348314605,
      payRate: 0.045573583831483064,
      seIpvUvHits: 54199.01092341032,
      searchWord: '李宁旗舰官网',
      soarRank: 0,
      tmClickRate: 0.8112931293720945
    },
    {
      clickHits: 40572.62674288568,
      clickRate: 1.3512670071563315,
      hotSearchRank: 2,
      p4pRefPrice: 112.2470950426271,
      payRate: 0.05452017035225171,
      seIpvUvHits: 53518.08161666663,
      searchWord: '回力官方旗舰店',
      soarRank: 0,
      tmClickRate: 0.9694422956676463
    },
    // ... 200 more items
  ],
  soarList: [  // 长尾词 - 飙升
    {
      clickHits: 2364.4090408957168,
      clickRate: 0.5555242786769881,
      hotSearchRank: 0,
      p4pRefPrice: 16,
      payRate: 0.004784688995215311,
      seIpvUvHits: 5961.865608751006,
      seRiseRate: 195.26666666666668,
      searchWord: '斐乐斐乐 休闲鞋',
      soarRank: 1
    },
    {
      clickHits: 1351.31570331586,
      clickRate: 0.029529737206085753,
      hotSearchRank: 0,
      seIpvUvHits: 13394.679503883212,
      seRiseRate: 70.06666666666666,
      searchWord: '天猫活力营',
      soarRank: 2
    },
    // ... 200 more items
  ]
}

const db_word = {
  "search_hotList": '[{...},{...}]',
  "search_soarList": '[{...},{...}]',
  "tail_hotList": '[{...},{...}]',
  "tail_soarList": '[{...},{...}]',
}
