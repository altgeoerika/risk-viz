'use client'
import { useEffect } from 'react'

import { getRiskData } from '../utils/get-data'
import { useStoreState, useStoreActions } from '../store'


const Dashboard = () => {
  const update = useStoreActions((action) => action.update)
  const data = useStoreState((state) => state.data)

  useEffect(() => {
    getRiskData().then(data => update({ data }))
  }, [update])

  return (
    <>
      {data?.length > 0 && <div>Home Test</div>}
    </>
  )
}

export default Dashboard
