import { RiskDataModel } from './types'
import { isObject } from '../utils/data-functions'


// ref: https://github.com/EQWorks/widget-studio/blob/7de59be2a258cd6633ff4eae887b1d2d9d0c4655/src/store/util.js#L4
const deepMerge = (payload: any, state: RiskDataModel): RiskDataModel => (
  Object.entries(payload).reduce((acc, [k, v]) => {
    acc[k] = isObject(v) && isObject(state[k])
      ? deepMerge(v, state[k])
      : v
    return acc
  }, { ...state })
)

export default deepMerge
