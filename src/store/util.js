const isObject = (v) => v !== null && !Array.isArray(v) && typeof v === 'object' && !(v instanceof HTMLElement)

const deepMerge = (payload, state) => (
  Object.entries(payload).reduce((acc, [k, v]) => {
    acc[k] = isObject(v) && isObject(state[k])
      ? deepMerge(v, state[k])
      : v
    return acc
  }, { ...state})
)

export default deepMerge
