const getObjKeysFromNestedCol = ({ data, key }: { data: any[], key: string }): string[] => {
  if (!data) {
    return []
  }
  return data?.reduce<string[]>((acc, el) => {
    const elKeys = Object.keys(el[key])
    return Array.from(new Set([...acc, ...elKeys]))
  }, [])
}


describe('getObjKeysFromNestedCol', () => {
  it('returns an array of all keys from the nested object in the data column', () => {
    const data = [
      { id: 1, name: 'John', details: { age: 30, gender: 'male' } },
      { id: 2, name: 'Mary', details: { age: 25 } },
      { id: 3, name: 'Jack', details: { gender: 'male' } }
    ]
    const key = 'details'
    const result = getObjKeysFromNestedCol({ data, key })
    expect(result).toEqual(['age', 'gender'])
  })

  it('returns an empty array when data is undefined', () => {
    const key = 'details'
    const result = getObjKeysFromNestedCol({ data: undefined, key })
    expect(result).toEqual([])
  })

  it('returns an empty array when data is an empty array', () => {
    const data: any[] = []
    const key = 'details'
    const result = getObjKeysFromNestedCol({ data, key })
    expect(result).toEqual([])
  })
})
