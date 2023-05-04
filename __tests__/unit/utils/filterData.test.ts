import {
  RiskFilters,
  RiskData,
} from '../../../src/store/types'


export const filterData = ({ data, filters }: { data: RiskData, filters: RiskFilters }): RiskData => {
  const filterKeys = Object.keys(filters)
  return data?.filter(el =>
    filterKeys.every(key =>
      el[key] === filters[key] ||
      (Array.isArray(filters[key]) &&
      el[key] >= filters[key][0] && el[key] <= filters[key][1]))) ||
  []
}
HTMLCanvasElement.prototype.getContext = jest.fn();

describe('filterData', () => {
  const data: RiskData = [
    { original: {}, Lat: 0, Lon: 0, 'Asset Name': 'Asset 1', 'Business Category': 'Category 1', 'Risk Rating': 1, 'Risk Factors': { Drought: 2 }, Year: 2021 },
    { original: {}, Lat: 1, Lon: 1, 'Asset Name': 'Asset 2', 'Business Category': 'Category 2', 'Risk Rating': 2, 'Risk Factors': { Hurricane: 3 }, Year: 2022 },
    { original: {}, Lat: 2, Lon: 2, 'Asset Name': 'Asset 3', 'Business Category': 'Category 1', 'Risk Rating': 3, 'Risk Factors': { Flooding: 4 }, Year: 2023 },
    { original: {}, Lat: 3, Lon: 3, 'Asset Name': 'Asset 4', 'Business Category': 'Category 2', 'Risk Rating': 4, 'Risk Factors': { Tornado: 5 }, Year: 2024 }
  ]

  it('returns data filtered by multiple filters', () => {
    const filters: RiskFilters = { 'Business Category': 'Category 2', 'Risk Rating': 2 }
    const result = filterData({ data, filters })
    expect(result).toEqual([{ original: {}, Lat: 1, Lon: 1, 'Asset Name': 'Asset 2', 'Business Category': 'Category 2', 'Risk Rating': 2, 'Risk Factors': { Hurricane: 3 }, Year: 2022 }])
  })

  it('returns data filtered by a range filter', () => {
    const filters: RiskFilters = { 'Risk Rating': [2, 3] }
    const result = filterData({ data, filters })
    expect(result).toEqual([
      { original: {}, Lat: 1, Lon: 1, 'Asset Name': 'Asset 2', 'Business Category': 'Category 2', 'Risk Rating': 2, 'Risk Factors': { Hurricane: 3 }, Year: 2022 },
      { original: {}, Lat: 2, Lon: 2, 'Asset Name': 'Asset 3', 'Business Category': 'Category 1', 'Risk Rating': 3, 'Risk Factors': { Flooding: 4 }, Year: 2023 }
    ])
  })

  it('returns the original data when no filters are applied', () => {
    const filters: RiskFilters = {}
    const result = filterData({ data, filters })
    expect(result).toEqual(data)
  })

  it('returns an empty array when data is undefined', () => {
    const data = undefined
    const filters: RiskFilters = { 'Risk Rating': 2 }
    const result = filterData({ data, filters })
    expect(result).toEqual([])
  })

  it('returns an empty array when data is null', () => {
    const data = null
    const filters: RiskFilters = { 'Risk Rating': 2 }
    const result = filterData({ data, filters })
    expect(result).toEqual([])
  })
})
