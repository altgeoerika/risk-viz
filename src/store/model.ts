import { action, computed } from 'easy-peasy'

import { RiskDataModel } from './types'
import {
  dataFilter,
  getDataKeyValues,
  getFlatData,
  getObjKeysFromNestedCol,
} from '../utils/data-functions'
import deepMerge from './util'


const model: RiskDataModel = {
  data: [],
  yearFilter: 2030,
  yearList: computed(
    [
      (state) => state.data,
    ],
    (
      data,
    ) => data?.length ? getDataKeyValues({ data, key: 'Year' }).sort((a, b) => a - b) : [],
  ),
  flatData: computed(
    [
      (state) => state.data,
    ],
    (
      data,
    ) => {
      const riskFactorKeys = getObjKeysFromNestedCol({ data, key: 'Risk Factors' })
      return data?.length ? getFlatData({ data, keyList: riskFactorKeys, col: 'Risk Factors' }) : []
    },
  ),
  filteredMapData: computed(
    [
      (state) => state.flatData,
      (state) => state.yearFilter,
    ],
    (
      flatData,
      yearFilter,
    ) => {
      return flatData?.length && dataFilter({ data: flatData, filters: { Year: yearFilter } }) || []}),
  update: action((state, payload) => deepMerge(payload, state)),
}

export default model
