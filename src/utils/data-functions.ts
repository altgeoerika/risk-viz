import {
  RiskFilters,
  RiskData,
  RiskDataObject,
  RiskFactors,
} from '../store/types'


export const isObject = (v: any): boolean => v !== null && !Array.isArray(v) && typeof v === 'object'

// get the list of values for a specific data key
export const getDataKeyValues = ({ data, key }: { data: RiskData, key: string }): any[] =>
  Array.from(new Set(data.map(d => d[key])))

// gets all the keys from a nexted object in a data column, where the objects don't include values for all keys
export const getObjKeysFromNestedCol = ({ data, key }: { data: RiskData, key: string }): string[] =>
  data.reduce<string[]>((acc, el) => {
    const elKeys = Object.keys(el[key])
    return Array.from(new Set([...acc, ...elKeys]))
  }, [])

// flatten data with nested json
export const getFlatData = ({ data, col, keyList }: { data: RiskData, col: string, keyList: string[] }): (RiskDataObject & RiskFactors)[] =>
  data.map((el) => {
    if (el[col] && typeof el[col] === 'object') {
      keyList.forEach((key) => {
        el[key] = el[col][key] || 0
      })
    }
    return el
  })

// filter data by multiple filters
export const dataFilter = ({ data, filters }: { data: RiskData, filters: RiskFilters }): RiskData => {
  const filterKeys = Object.keys(filters)
  return data.reduce<RiskData>((acc, el) =>
    filterKeys.every(key =>
      el[key] === filters[key] || (Array.isArray(filters[key]) && el[key] >= filters[key][0] && el[key] <= filters[key][1])) ?
      [...acc, el] : acc, [])
}
