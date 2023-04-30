import { action, computed } from 'easy-peasy'
import * as dfd from 'danfojs'

import { RiskDataModel } from './types'
import {
  filterData,
  getDataKeyValues,
  getFlatData,
  getObjKeysFromNestedCol,
  groupChartData,
} from '../utils/data-functions'
import deepMerge from './util'
import { YEAR } from '../constants'


const model: RiskDataModel = {
  data: [],
  selMapLocation: null,
  chartAggKey: '',
  chartAggVal: '',
  yearFilter: null,
  useMapLocation: false,
  dataKeyTypes: computed(
    [
      (state) => state.data,
    ],
    (
      data,
    ) => {
      let keyTypes = {}
      if (data?.length) {
        Object.keys(data[0]).forEach(key => keyTypes[key] = typeof data[0][key])
      }
      return keyTypes
    },
  ),
  yearList: computed(
    [
      (state) => state.data,
    ],
    (
      data,
    ) => data?.length ? getDataKeyValues({ data, key: YEAR }).sort((a, b) => a - b) : [],
  ),
  dataAggKeys: computed(
    [
      (state) => state.data,
    ],
    (
      data,
    ) =>
      data?.length &&
      Object.keys(data[0]).filter(el => typeof data[0][el] === 'string' && !['lat', 'lon'].includes(el)) ||
      [],
  ),
  aggKeyValues: computed(
    [
      (state) => state.data,
      (state) => state.chartAggKey,
    ],
    (
      data,
      chartAggKey,
    ) => {
      return data?.length ? getDataKeyValues({ data, key: chartAggKey }).sort((a, b) => a - b) : []
    },
  ),
  chartData: computed(
    [
      (state) => state.data,
      (state) => state.dataKeyTypes,
      (state) => state.chartAggKey,
      (state) => state.chartAggVal,
      (state) => state.aggKeyValues,
    ],
    (
      data,
      dataKeyTypes,
      chartAggKey,
      chartAggVal,
      aggKeyValues,
    ) => {
      let aggChartData: dfd.DataFrame
      if (data?.length && chartAggKey && aggKeyValues.includes(chartAggVal)) {
        aggChartData = groupChartData({ data, dataKeyTypes, chartAggKey, chartAggVal }) || new dfd.DataFrame([])
      }
      if (aggChartData) {
        return aggChartData.mean()
      }
      return new dfd.DataFrame([])
    },
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
    ) => flatData?.length && filterData({ data: flatData, filters: { [YEAR]: yearFilter } }) || [],
  ),
  update: action((state, payload) => deepMerge(payload, state)),
}

export default model
