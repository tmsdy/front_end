const fetchTimeoutDecorator = (fetchData, timeout = 10000) =>
  Promise.race([
    fetchData,
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'timeout', msg: '网络超时' })
      }, timeout)
    })
  ])

export default class PlanSubmitter {
  constructor(plan, updateProgress) {
    this.plan = plan
    this.updateProgress = updateProgress
    this.total = this.plan.unitList.length * 2 + 2
    this.init()
  }

  init() { // 初始化
    this.count = 0
    this.display = this.initDisplay()
    this._state = {
      dzPattern: 'one-one',
      currentPlanId: null,
      unitIdList: [],

    }
    this._status = {
      createPlan: 'initial',
      createUnit: 'initial',
      createCreate: 'initial'
    }
  }

  initDisplay() {
    let plan = this.plan
    return {
      planName: plan.planName,
      unitName: plan.unitList[0].unitName || '',
      crowdsName: plan.unitList[0].crowdsName || '',
      status: {
        text: '等待中', // 等待中 提交中 提交失败 提交超时 提交成功
        progress: 0, // 提交的进度
      },
      description: '', // 终止原因说明
    }
  }

  handleException(errorRes) {
    let status = errorRes.status
    if (status === 'error') {
      this.display.status.text = '提交失败'
      this.display.description = errorRes.msg
      return false
    }
    if (status === 'timeout') {
      this.display.status.text = '提交超时'
      this.display.description = errorRes.msg
      return false
    }
  }

  async start() {
    // 1.创建计划
    if (this._status.createPlan !== 'success') {
      this.display.status.text = '提交中'
      let createPlanRes = await this.createPlan()
      console.log('创建计划结果：', createPlanRes)
      let createPlanStatus = createPlanRes.status
      this._status.createPlan = createPlanStatus
      if (createPlanStatus === 'success') {
        this.updateProgress()
        this._state.currentPlanId = createPlanRes.planId
      }
      if (this.handleException(createPlanRes) === false) {
        return false
      }
    }

    // 创建单元或者保存创意的超时重试
    if ([this._status.createUnit, this._status.createCreate].includes('timeout')) {
      this.init()
      return this.start()
    }

    // 2.创建单元
    if (['initial', 'error'].includes(this._status.createUnit)) {
      let createUnitRes = await this.createUnit()
      console.log('创建单元结果：', createUnitRes)
      let createUnitStatus = createUnitRes.status
      this._status.createUnit = createUnitStatus
      if (createUnitStatus === 'success') {
        console.log('创建单元列表成功', createUnitRes)
      }
      if (this.handleException(createUnitRes) === false) {
        return false
      }
    }

    // 3.保存创意
    if (['initial', 'error'].includes(this._status.createCreate)) {
      let createCreateRes = await this.createCreate()
      console.log('保存创意结果==', createCreateRes)
      let createCreateStatus = createCreateRes.status
      this._status.createCreate = createCreateStatus

      if (createCreateStatus === 'success') {
        // console.log('保存创意成功', createCreateRes)
      }
      if (this.handleException(createCreateRes) === false) {
        return false
      }
    }

    // 4.提交计划
    let submitRes = await this.submit()
    console.log('提交计划结果：', submitRes)
    let submitStatus = submitRes.status
    if (submitStatus === 'success') {
      this.display.status.text = '提交成功'
      this.display.description = '提交成功'
      this.updateProgress()
      return true
    }
    if (this.handleException(createCreateRes) === false) {
      return false
    }
  }

  createPlan() { // 1.创建计划
    return fetchTimeoutDecorator(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          let planId = this.plan.planName.length
          resolve({
            status: 'success',
            planId
          })
          // reject()
        }, 1000)
      })
        .catch(e => {
          return {
            status: 'error',
            msg: err
          }
        })
      ,
      5000
    )
  }

  async createUnit() {
    let len = this._state.unitIdList.length
    let unit = this.plan.unitList[len]
    return fetchTimeoutDecorator(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          // 需要用到计划id
          console.log('用到了计划id和人群：', this._state.currentPlanId, unit)
          resolve(len + 1)
          // reject()
        }, 500)
      })
        .then((unitId) => {
          this.updateProgress()
          this._state.unitIdList.push(unitId)
          if (len + 1 >= this.plan.unitList.length) {
            return {
              status: 'success'
            }
          } else {
            return this.createUnit()
          }
        })
        .catch(e => {
          return {
            status: 'error',
            msg: err
          }
        })
    )
  }

  async createCreate() {
    let unitId = this._state.unitIdList[0]
    return fetchTimeoutDecorator(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('用到了单元id: ', unitId)
          // reject('出错了')
          resolve()
        }, 500)
      }).then(() => {
        this.updateProgress()
        this._state.unitIdList.shift()
        if (this._state.unitIdList.length === 0) {
          return {
            status: 'success'
          }
        } else {
          return this.createCreate()
        }
      }).catch(err => {
        return {
          status: 'error',
          msg: err
        }
      })
    )
  }

  submit() { // 4.提交计划
    return fetchTimeoutDecorator(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            status: 'success'
          })
          // reject()
        }, 1000)
      })
        .catch(err => {
          return {
            status: 'error',
            msg: err
          }
        })
      ,
      4000
    )
  }

}
