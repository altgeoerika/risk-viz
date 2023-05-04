import * as dfd from 'danfojs'

import {
  RiskFilters,
  RiskData,
  RiskDataObject,
  RiskFactors,
} from '../store/types'
import { YEAR, LAT_LON } from '../constants'


export const isObject = (v: any): boolean => v !== null && !Array.isArray(v) && typeof v === 'object'

// get the list of values for a specific data key
export const getDataKeyValues = ({ data, key }: { data: RiskData, key: string }): any[] =>
  Array.from(new Set(data?.map(d => d[key])))

// gets all the keys from a nested object in a data column, where the objects don't include values for all keys
export const getObjKeysFromNestedCol = ({ data, key }: { data: any[], key: string }): string[] => {
  if (!data) {
    return []
  }
  return data?.reduce<string[]>((acc, el) => {
    const elKeys = Object.keys(el[key])
    return Array.from(new Set([...acc, ...elKeys]))
  }, [])
}

// flatten data with nested json
export const getFlatData = ({ data, col, keyList }: { data: RiskData, col: string, keyList: string[] }): (RiskDataObject & RiskFactors)[] =>
  data?.map((el) => {
    if (el[col] && typeof el[col] === 'object') {
      keyList.forEach((key) => {
        el[key] = el[col][key] || 0
      })
    }
    return el
  })

// filter data by multiple filters
export const filterData = ({ data, filters }: { data: RiskData, filters: RiskFilters }): RiskData => {
  if (!data) {
    return []
  }
  const filterKeys = Object.keys(filters)
  return data?.filter(el =>
    filterKeys.every(key =>
      el[key] === filters[key] ||
      (Array.isArray(filters[key]) &&
      el[key] >= filters[key][0] && el[key] <= filters[key][1])))
}

// adds a new LAT_LON string column to the data array
export const enrichLatLonCol = (data: object[]): object=> {
  if (data?.length) {
    const df: dfd.DataFrame = new dfd.DataFrame(data)
    const colLat = df.column('lat').asType('string')
    const colLon = df.column('lon').asType('string')
    const colLatJoined = colLat.str.join('/ ', ' ', { inplace: false })
    const latVal = colLatJoined.values.map((val: any) => val.toString())
    const lonLatCol = colLon.str.concat(latVal, 0)
    df.addColumn(LAT_LON, lonLatCol, { inplace: true })
    if (df) {
      return dfd.toJSON(df) || []
    }
    return []
  }
  return []
}

// group data for line chart
export const groupChartData = (
  {
    data,
    dataKeyTypes,
    chartAggKey,
    chartAggVal,
  }:
  {
    data: RiskData,
    dataKeyTypes: object,
    chartAggKey: string,
    chartAggVal: string,
  }): dfd.DataFrame => {
  const colsToDrop = Object.keys(dataKeyTypes)
    .filter(col => (dataKeyTypes[col] !== 'number' && col !== chartAggKey) || ['lat', 'lon'].includes(col))
  const filteredData = filterData({ data, filters: { [chartAggKey]: chartAggVal } })
  const df: any = new dfd.DataFrame(filteredData)
  df?.drop({ columns: colsToDrop, inplace: true })
  df?.sortValues(YEAR, { inplace: true })
  return df?.groupby([chartAggKey, YEAR])
}
