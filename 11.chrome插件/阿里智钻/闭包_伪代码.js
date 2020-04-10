
let blocker = (err) => {
  console.log('出问题了 === ', err)
}

let one_one = [
  (function (blocker) {
    let step = 0
    let current_plan_id = 0
    let current_unit_id = 0

    let createPlan = () => { // 1.创建计划
      let status = 0
      if (status === 0) {
        let plan_id = 1
        current_plan_id = plan_id
        console.log('创建计划成功:', plan_id)
        createUnit(plan_id)
      }
      if (status === 1) {
        blocker('创建计划失败')
        console.log('创建计划失败')
      }
      if (status === 2) {
        console.log('创建计划超时')
      }
    }

    let createUnit = (plan_id) => { // 2.创建单元
      let status = 1
      step = 1
      if (status === 0) {
        let unit_id = 1 + plan_id
        console.log('创建单元成功 :', unit_id)
        createCreate(unit_id)
      }
      if (status === 1) {
        blocker('创建单元失败')
        console.log('创建单元失败')
      }
      if (status === 2) {
        step = 0
        blocker('创建单元超时')
        console.log('创建单元超时')
      }
    }

    let createCreate = (unit_id) => { // 3.保存创意
      let status = 0
      step = 2
      if (status === 0) {
        console.log('保存创意成功 :', unit_id)
        submit()
      }
      if (status === 1) {
        console.log('保存创意失败')
      }
      if (status === 2) {
        step = 0
        console.log('保存创意超时')
      }
    }

    let submit = () => { // 4.提交计划
      let status = 0
      step = 3
      if (status === 0) {
        console.log('提交当前计划成功 :', current_plan_id)
        one_one.shift()
        console.log(one_one)
      }
      if (status === 1) {
        console.log('提交当前计划失败')
      }
      if (status === 2) {
        step = 3
        console.log('提交当前计划超时')
      }
    }

    return function (plan) {
      console.log('step ==', step)
      switch (step) {
        case 0: createPlan(); break;
        case 1: createUnit(current_plan_id); break;
        case 2: createCreate(current_unit_id); break;
        case 3: submit(); break;
        default: break;
      }
    }
  })
]
let new_one_one = one_one.map(item => item(blocker)) // 生成闭包函数
new_one_one.forEach(item => item()) // 提交

setTimeout(() => { // 模拟重试
  new_one_one.forEach(item => item())
}, 3000);