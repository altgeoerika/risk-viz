import { useStoreState, useStoreActions } from './store'
import { getRiskData  } from './utils/get-data'


// fetch data
export const useData = () => {
  const update = useStoreActions((action) => action.update)
  const data = useStoreState((state) => state.data)

  if (!data?.length) {
    getRiskData().then(data => update({ data }))
  }
}
