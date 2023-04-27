'use client'
import { useEffect } from 'react'
// @ts-ignore
import { QLReportMap } from '@eqworks/react-maps'


import DropdownSelect from '../../common-components/dropdown-select'
import { getRiskData } from '../../../utils/get-data'
import { useStoreState, useStoreActions } from '../../../store'
import styles from './map.module.scss'


const RiskMap = () => {
  const update = useStoreActions((action) => action.update)
  const data = useStoreState((state) => state.data)
  const filteredMapData = useStoreState((state) => state.filteredMapData)
  const yearList = useStoreState((state) => state.yearList)

  console.log('filteredMapData: ', filteredMapData)

  useEffect(() => {
    if (!data.length) {
      getRiskData().then(data => update({ data }))
    }
  }, [data.length, update] )

  return (
    <>
      {filteredMapData?.length > 0  &&
        <div>
          <div className='absolute z-100 mt-3'>
            <DropdownSelect data={yearList} onSelect={(val: number) => {
              update({ yearFilter: val })}}/>
          </div>
          <div className={styles['map-container']}>
            <QLReportMap
              reportData={filteredMapData}
              showTooltip={true}
              fillBasedOn='Risk Rating'
              fillColors={['#09d65b', '#EFEE07', '#f00707']}
              getRadius={5}
              showLegend={true}
              opacity={.5}
              tooltipKeys={{
                tooltipTitle1: 'Asset Name',
                tooltipTitle2: 'Business Category',
                metricKeys: ['Risk Rating'],
              }}
              legendPosition='top-right'
              mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
            />
          </div>
        </div>
      }
    </>
  )
}

export default RiskMap
