import {
  isArray,
  isObject,
} from "./verify"

// deep clone by recursion
export const clone = obj => {
  const cloneGenetator = val => {
    if (isObject(val)) {
      let o = {}
      for (let p in val) {
        const v = val[p]
        if (isObject(v)) {
          o[p] = cloneGenetator(v)
        } else if (isArray(v)) {
          o[p] = v.map(k => cloneGenetator(k))
        } else {
          o[p] = v
        }
      }
      return o
    } else if (isArray(val)) {
      return val.map(k => cloneGenetator(k))
    } else {
      return val
    }
  }

  return cloneGenetator(obj)
}

// deep clone by json
export const cloneByJSON = obj => obj ? JSON.parse(JSON.stringify(obj)) : null
