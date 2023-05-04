// import { getDataKeyValues } from '../../../src/utils/data-functions'
const getDataKeyValues = ({ data, key }: { data: any[], key: string }): any[] =>
  Array.from(new Set(data?.map(d => d[key])))



describe('getDataKeyValues', () => {
  it('returns an array of unique values from the provided data key', () => {
    const data = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Mary' },
      { id: 3, name: 'John' }
    ]
    const key = 'name'
    const result = getDataKeyValues({ data, key })
    expect(result).toEqual(['John', 'Mary'])
  })

  it('returns an empty array when data is undefined', () => {
    const key = 'name'
    const result = getDataKeyValues({ data: undefined, key })
    expect(result).toEqual([])
  })

  it('returns an empty array when data is an empty array', () => {
    const data: any[] = []
    const key = 'name'
    const result = getDataKeyValues({ data, key })
    expect(result).toEqual([])
  })
})