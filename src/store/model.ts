import { action } from 'easy-peasy'

import { RiskDataModel } from './types'
import deepMerge from './util'


const model: RiskDataModel = {
  data: [],
  update: action((state, payload) => deepMerge(payload, state)),
}

export default model
