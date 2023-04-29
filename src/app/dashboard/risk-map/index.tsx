'use client'
import { useState, useEffect } from 'react'
import { QLReportMap } from '@geoerika/react-maps'

import DropdownSelect from '../../common-components/dropdown-select'
import { useStoreState, useStoreActions } from '../../../store'
import { useData } from '../../../hooks'
import { YEAR } from '../../../constants'
import styles from './map.module.scss'


const RiskMap = () => {
  const update = useStoreActions((action) => action.update)
  const filteredMapData = useStoreState((state) => state.filteredMapData)
  const yearFilter = useStoreState((state) => state.yearFilter)
  const yearList = useStoreState((state) => state.yearList)
  // const selMapLocation = useStoreState((state) => state.selMapLocation)

  const [selYear, setSelYear] = useState(yearFilter)

  useEffect(() => {
    if (selYear !== yearFilter) {
      setSelYear(yearFilter)
    }
  }, [selYear,yearFilter, setSelYear])

  useData()

  return (
    <>
      {filteredMapData?.length > 0  &&
        <div>
          <div className='absolute z-100'>
            <DropdownSelect
              data={yearList}
              valKey={selYear}
              label={YEAR}
              onSelect={(val: number) => {update({ yearFilter: val })}}
            />
          </div>
          <div className={styles['map-container']}>
            <QLReportMap
              reportData={filteredMapData}
              showTooltip={true}
              fillBasedOn='Risk Rating'
              fillColors={['#09d65b', '#EFEE07', '#f00707']}
              getRadius={5}
              onClick={(obj: any) => update({ selMapLocation: obj })}
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
