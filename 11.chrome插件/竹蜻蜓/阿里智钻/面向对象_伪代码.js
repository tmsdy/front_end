class PlanSubmitter {
  constructor(plan) {
    this.plan = plan
    this.state = {
      dzPattern: 'one-one',
      step: 0,
      currentPlanId: null,
      unitIdList: []
    }
    this.status = {
      createPlan: 'initial', // 'initial' 'error' 'timeout' 'success'
      createUnitList: 'initial',
      createCreate: 'initial',
      submit: 'initial',
    }
  }

  async start() {
    // 1.创建计划
    if (this.status.createPlan !== 'success') {
      let createPlanRes = await this.createPlan()
      let createPlanStatus = createPlanRes.status
      this.status.createPlan = createPlanStatus
      if (createPlanStatus === 'success') {
        console.log('创建计划成功', createPlanRes)
        this.state.currentPlanId = createPlanRes.planId
      } else {
        return {
          err: '创建计划失败'
        }
      }
    }

    // 2.创建单元
    if (this.status.createUnitList === ('initial' || 'error')) {
      let createUnitListRes = await this.createUnitList()
      let createUnitListStatus = createUnitListRes.status
      this.status.createUnitList = createUnitListStatus

      if (createUnitListStatus === 'success') {
        console.log('创建单元列表成功', createUnitListRes)
      } else {
        console.log('创建单元列表状态：', createUnitListStatus)
        return {
          err: '创建单元列表失败'
        }
      }
    }

    // 3.保存创意
    if (this.status.createCreate === ('initial' || 'error')) {
      let createCreateRes = await this.createCreateList()
      console.log('createCreateRes==', createCreateRes)
      let createCreateStatus = createCreateRes.status
      this.status.createCreate = createCreateStatus

      if (createCreateStatus === 'success') {
        console.log('保存创意成功', createCreateRes)

      } else {
        return {
          err: '保存创意失败'
        }
      }
    }

    // 创建单元或者保存创意的超时重试
    if (
      this.status.createUnitList === 'timeout'
      || this.status.createCreate === 'timeout'
    ) {
      this.status.createPlan = 'initial'
      this.start()
    }

    // 4.提交计划

  }

  createPlan() { // 1.创建计划
    let status = 0
    if (status === 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let planId = this.plan.planName.length
          resolve(planId)
        }, 500)
      }).then(planId => {
        return {
          status: 'success',
          planId
        }
      })
    }
    if (status === 1) {
      return {
        status: 'error'
      }
    }
    if (status === 2) {
      return {
        status: 'timeout'
      }
    }
  }

  async createUnitList() { // 2.创建单元
    let createUnitRes = await this.createUnit()
    console.log('createUnitRes==', createUnitRes)
    let createUnitStatus = createUnitRes.status
    if (createUnitStatus === 'success') {
      return {
        status: 'success'
      }
    }
  }

  createUnit() {
    let status = 0
    let len = this.state.unitIdList.length
    let unit = this.plan.unitList[len]
    if (status === 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 需要用到计划id
          console.log('用到了计划id和人群：', this.state.currentPlanId, unit)
          resolve(len + 1)
        }, 500)
      }).then((unitId) => {
        this.state.unitIdList.push(unitId)
        if (len + 1 >= this.plan.unitList.length) {
          return {
            status: 'success'
          }
        } else {
          return this.createUnit()
        }
      })
    }
    if (status === 1) {
      return {
        status: 'error'
      }
    }
    if (status === 2) {
      return {
        status: 'timeout'
      }
    }
  }

  async createCreateList() { // 3.保存创意
    let createCreateRes = await this.createCreate()
    console.log('createUnitRes==', createCreateRes)
    let createCreateStatus = createCreateRes.status
    if (createCreateStatus === 'success') {
      return {
        status: 'success'
      }
    }
  }

  createCreate() {
    let status = 0
    let unitId = this.state.unitIdList[0]
    if (status === 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('用到了单元id: ', unitId)
          resolve()
        }, 500)
      }).then(() => {
        this.state.unitIdList.shift()
        if (this.state.unitIdList.length === 0) {
          console.log('返回成功了')
          return {
            status: 'success'
          }
        } else {
          return this.createCreate()
        }
      })
    }
    if (status === 1) {
      return {
        status: 'error'
      }
    }
    if (status === 2) {
      return {
        status: 'timeout'
      }
    }
  }

  submit() { // 4.提交计划
    let status = 0
    this.state.step = 3
    if (status === 0) {
      console.log('提交当前计划成功 :', this.state.currentPlanId)
      // 通知外边执行下一个计划
    }
    if (status === 1) {
      this.block(this.plan.key, '提交当前计划失败')
      console.log('提交当前计划失败')
    }
    if (status === 2) {
      this.block(this.plan.key, '提交当前计划超时')
      console.log('提交当前计划超时')
    }
  }

  retry() {
    this.start()
  }
}

let planList = [ // 提交前的计划列表
  {
    key: 111,
    planName: '可以编辑的计划名', // 计划名
    unitList: [ // 单元列表
      {
        unitName: 'DZ_达摩盘精选-活动人群111', // 单元名
        crowdsName: '达摩盘精选-活动人群111', // 人群名
        crowds: [ // 人群信息
          {}
        ]
      },
      {
        unitName: 'DZ_达摩盘精选-活动人群222', // 单元名
        crowdsName: '达摩盘精选-活动人群222', // 人群名
        crowds: [ // 人群信息
          {}
        ]
      }
    ]
  },
  // ...
]
// * 第一步：点击提交后，由计划列表生成执行列表
// let submitList = [
//   {
//     key: 10086,
//     planName: '展示的计划名',
//     unitName: '展示的单元名',
//     crowdsName: '展示的人群名',
//     status: 0, // 0 待提交(默认) 1 提交中 2 因失败中止 3 因超时中止 4 提交成功
//     discription: '', // 终止原因说明
//     planSubmitter: new PlanSubmitter(block, plan) // 计划提交者
//   }
// ]

let block = (key, err) => { // key 当前中断的计划
  console.log('出错了！===', key, err)
  // 告诉当前组件哪个组件中断了，出错原因，并把出错原因赋值给discription
}

let submitList = planList.map(item => {
  return {
    planName: '展示的计划名',
    unitName: '展示的单元名',
    crowdsName: '展示的人群名',
    status: 0,
    discription: '',
    planSubmitter: new PlanSubmitter(item)
  }
})
submitList[0].planSubmitter.retry()
// setTimeout(() => {
//   submitList[0].planSubmitter.retry()
// }, 4000);

let retry = (key) => {
  // 找执行列表的对应计划key，改变其status为1，执行planSubmitter.retry()
}