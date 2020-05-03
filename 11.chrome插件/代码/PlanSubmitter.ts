import { readGBK } from '../../utils'
import { IRequestOptions, Status, IDisplay, IPlan, IRequestList } from './type'

const fetchTimeoutDecorator = (fetchData, timeout = 10000) =>
  Promise.race([
    fetchData,
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'timeout', msg: '网络超时' })
      }, timeout)
    })
  ])

const formatRequest = (request) => {
  let body = null
  const { url, method, requestHeaders, requestBody } = request
  const headers = {}
  requestHeaders.forEach((item) => {
    headers[item.name] = item.value
  })
  if (method === 'POST' || method === 'PUT') {
    const formData = requestBody.formData
    // 请求 body 处理
    const tempBody = []
    Object.keys(formData).forEach((key) => {
      // body[key] = formData[key][0]
      tempBody.push(`${key}=${encodeURIComponent(formData[key][0])}`)
    })
    body = tempBody.join('&')
  }

  const params = {
    method,
    headers,
    url,
    body
  }
  // 添加特殊标记，防止 blocker 拦截
  const newUrl = `${params.url}${/\?/.test(url) ? '&' : '?'}web_request_block=0`
  return {
    ...params,
    url: newUrl
  }
}

const fetchDataByRequest = async (request) => {
  const { method, url, headers, body } = request

  const options: IRequestOptions = {
    method,
    headers
  }
  if (method === 'POST' || method === 'PUT') {
    options.body = body
  }

  const res = await fetch(url, options)
    .then(async (response) => {
      if (!response.ok) {
        return {
          status: 'error',
          errCode: 'error',
          msg: `接口返回了 ${response.status} 错误`
        }
      }
      if (options.responseType === 'blob') {
        const bolbRes = await response.blob()
        const newRes = await readGBK(bolbRes)
        return newRes
      }
      return response.json()
    })
    .catch((e) => {
      console.log(`fetchDataByBlockerUrl err => :`, e)
      return {
        status: 'error',
        errCode: '3',
        msg: '未知错误'
      }
    })
  return res
}

export default class PlanSubmitter {
  private status: {
    createPlan: Status,
    createUnit: Status,
    createCreate: Status,
    submitPlan: Status
  }
  public count: number
  public total: number
  public state: {
    currentPlanId: number | string | null
    unitIdList: any[]
  }
  public display: IDisplay

  constructor(
    public plan: IPlan,
    public updateProgress: () => void,
    public requests: IRequestList
  ) {
    this.total = this.plan.unitList.length * 3 + 3
    this.init()
  }

  public init() { // 初始化
    this.count = 0
    this.display = this.initDisplay()
    this.state = {
      currentPlanId: null,
      unitIdList: []
    }
    this.status = {
      createPlan: Status.Initial,
      createUnit: Status.Initial,
      createCreate: Status.Initial,
      submitPlan: Status.Initial,
    }
  }

  public initDisplay() {
    const plan = this.plan
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

  handleException(errorRes: { status: string, msg: string }) {
    const { status, msg } = errorRes
    if (status === 'error') {
      this.display.status.text = '提交失败'
      this.display.description = msg
      return false
    }
    if (status === 'timeout') {
      this.display.status.text = '提交超时'
      this.display.description = msg
      return false
    }
  }

  async start() {
    // 1.创建计划
    if (this.status.createPlan !== Status.Success) {
      this.display.status.text = '提交中'
      const createPlanRes = await this.createPlan()
      const createPlanStatus = createPlanRes.status
      this.status.createPlan = createPlanStatus
      if (createPlanStatus === 'success') {
        this.updateProgress()
        this.state.currentPlanId = createPlanRes.planId
      }
      if (this.handleException(createPlanRes) === false) {
        return false
      }
    }

    // 创建单元或者保存创意的超时重试
    if ([this.status.createUnit, this.status.createCreate].includes(Status.Timeout)) {
      this.init()
      return this.start()
    }

    // 2.创建单元
    if ([Status.Initial, Status.Error].includes(this.status.createUnit)) {
      const createUnitRes = await this.createUnit()
      console.log('创建单元结果：', createUnitRes)
      const createUnitStatus = createUnitRes.status
      this.status.createUnit = createUnitStatus
      if (createUnitStatus === 'success') {
        console.log('创建单元列表成功', createUnitRes)
      }
      if (this.handleException(createUnitRes) === false) {
        return false
      }
    }

    // 3.保存创意
    if ([Status.Initial, Status.Error].includes(this.status.createCreate)) {
      const createCreateRes = await this.createCreate()
      console.log('保存创意结果：', createCreateRes)
      const createCreateStatus = createCreateRes.status
      this.status.createCreate = createCreateStatus

      if (this.handleException(createCreateRes) === false) {
        return false
      }
    }

    // 4.提交计划
    if (this.status.submitPlan !== Status.Success) {
      const submitRes = await this.submit()
      console.log('提交计划结果：', submitRes)
      const submitStatus = submitRes.status
      this.status.submitPlan = submitStatus
      if (submitStatus === 'success') {
        this.display.status.text = '提交成功'
        this.display.description = '提交成功'
        this.updateProgress()
      }
      if (this.handleException(submitRes) === false) {
        return false
      }
    }

    // 5.暂停计划投放
    const pausePlanRes = await this.pausePlan()
    console.log('暂停计划结果：', pausePlanRes)
    const pausePlanStatus = pausePlanRes.status
    if (pausePlanStatus === 'success') {
      this.display.status.text = '提交成功(已暂停)'
      this.display.description = '提交成功(已暂停)'
      this.updateProgress()
      return true
    }
    if (['error', 'timeout'].includes(pausePlanStatus)) {
      this.display.status.text = '提交成功(暂停失败)'
      this.display.description = '提交成功(暂停失败)'
      return false
    }
  }

  public createPlan() { // 1.创建计划
    const addPlanRequest = this.requests.addPlanRequest
    addPlanRequest.requestBody.formData.campaignName = [this.plan.planName]
    return fetchTimeoutDecorator(
      fetchDataByRequest(formatRequest(addPlanRequest))
        .then((res) => {
          console.log('创建计划结果==', res)
          if (res.info && res.info.ok) {
            return {
              status: 'success',
              planId: res.data.campaignId
            }
          } else {
            return {
              status: 'error',
              msg: res.msg
            }
          }
        })
        .catch((e) => {
          return {
            status: 'error',
            msg: e
          }
        })
      ,
      5000
    )
  }

  createUnit() {
    const { currentPlanId, unitIdList } = this.state
    const len = unitIdList.length
    const unit = this.plan.unitList[len]
    const addUnitRequest = this.requests.addUnitRequest
    const getBidPriceRequest = this.requests.getBidPriceRequest
    const defaultCrowds = JSON.parse(addUnitRequest.requestBody.formData.crowds)
    const matrixPrice = defaultCrowds[0].matrixPrice

    // 获取市场价bidPrice
    getBidPriceRequest.requestBody.formData = {
      ...getBidPriceRequest.requestBody.formData,
      campaignId: [String(currentPlanId)],
      crowds: [JSON.stringify(defaultCrowds)],
      adzoneIds: matrixPrice.map((item) => (item.adzoneId))
    }
    // console.log('getBidPriceRequest==', getBidPriceRequest)
    return fetchTimeoutDecorator(
      new Promise(async (resolve, reject) => {
        const getBidPriceRes = await fetchDataByRequest(formatRequest(getBidPriceRequest))
        console.log('getBidPriceRes==', getBidPriceRes)
        if (getBidPriceRes.info && getBidPriceRes.info.ok) {
          const suggestBidPrice = getBidPriceRes.data.suggestBidPrice
          this.updateProgress()
          matrixPrice.forEach((item) => {
            item.bidPrice = String(suggestBidPrice)
          })
        } else {
          resolve({
            status: 'error',
            msg: `创建单元失败：${getBidPriceRes.info.message}`
          })
        }
        unit.crowds[0].matrixPrice = matrixPrice
        addUnitRequest.requestBody.formData.adgroupName = [unit.unitName]
        addUnitRequest.requestBody.formData.campaignId = [String(currentPlanId)]
        addUnitRequest.requestBody.formData.crowds = [JSON.stringify(unit.crowds)]

        fetchDataByRequest(formatRequest(addUnitRequest))
          .then((res: any) => {
            if (res.info && res.info.ok) {
              this.updateProgress()
              this.state.unitIdList.push(res.data.adgroupId)
              if (len + 1 >= this.plan.unitList.length) {
                resolve({
                  status: 'success'
                })
              } else {
                resolve(this.createUnit())
              }
            } else {
              resolve({
                status: 'error',
                msg: `创建单元失败：${res.info.message}`
              })
            }
          })
          .catch((err) => {
            resolve({
              status: 'error',
              msg: `创建单元失败：${err}`
            })
          })
      }),
      15000
    )
  }

  async createCreate() {
    const saveCreativeRequest = this.requests.saveCreativeRequest
    // tslint:disable-next-line:no-eval
    const bindCreative = eval(saveCreativeRequest.requestBody.formData.bindCreatives[0])
    bindCreative[0].adgroupId = this.state.unitIdList[0]
    saveCreativeRequest.requestBody.formData.bindCreatives = [JSON.stringify(bindCreative)]
    return fetchTimeoutDecorator(
      fetchDataByRequest(formatRequest(saveCreativeRequest))
        .then((res) => {
          if (res.info.ok) {
            this.updateProgress()
            this.state.unitIdList.shift()
            if (this.state.unitIdList.length === 0) {
              return {
                status: 'success'
              }
            } else {
              return this.createCreate()
            }
          } else {
            return {
              status: 'error',
              msg: `保存创意失败：${res.info.message}`
            }
          }
        })
        .catch((err) => {
          return {
            status: 'error',
            msg: `保存创意失败：${err}`
          }
        })
    )
  }

  submit() { // 4.提交计划
    const submitPlanRequest = this.requests.submitPlanRequest
    submitPlanRequest.requestBody.formData.campaignId = [String(this.state.currentPlanId)]
    return fetchTimeoutDecorator(
      fetchDataByRequest(formatRequest(submitPlanRequest))
        .then((res) => {
          if (res.info.ok) {
            return {
              status: 'success'
            }
          } else {
            return {
              status: 'error'
            }
          }
        })
        .catch((err) => {
          return {
            status: 'error',
            msg: err
          }
        })
    )
  }

  pausePlan() {
    const pausePlanRequest = this.requests.pausePlanRequest
    pausePlanRequest.requestBody.formData.campaignIdList = [JSON.stringify([String(this.state.currentPlanId)])]
    pausePlanRequest.requestBody.formData.status = ["0"]
    return fetchTimeoutDecorator(
      fetchDataByRequest(formatRequest(pausePlanRequest))
        .then((res) => {
          if (res.info.ok) {
            return {
              status: 'success'
            }
          } else {
            return {
              status: 'error'
            }
          }
        })
        .catch((err) => {
          return {
            status: 'error',
            msg: err
          }
        })
    )
  }

}
