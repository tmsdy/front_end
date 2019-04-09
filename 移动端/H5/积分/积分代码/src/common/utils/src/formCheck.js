/**
 * Created by liuzhimeng.
 * @date 2018/8/15
 * @description
 */

export function getFormData($form) {
  let data = {}
  $form.serializeArray().forEach(i => {
    data[i.name] = i.value
  })
  return data
}

export function isMobile(str) {
  return /^1[345789]\d{9}$/.test(str)
}
