'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { QLReportMap } from '@geoerika/react-maps'

import { useData } from '../../../hooks'
import { useStoreState, useStoreActions } from '../../../store'
import { YEAR, RISK_TYPES, LAT_LON } from '../../../constants'
import styles from './map.module.scss'


const DropdownSelect = dynamic(
  () => import('../../common-components/dropdown-select'),
  {
    ssr: false,
    loading: () => <>Loading...</>,
  },
)

const Switch = dynamic(
  () => import('../../common-components/switch'),
  {
    ssr: false,
    loading: () => <>Loading...</>,
  },
)

const RiskMap = () => {
  const update = useStoreActions((action) => action.update)
  const filteredMapData = useStoreState((state) => state.filteredMapData)
  const yearFilter = useStoreState((state) => state.yearFilter)
  const yearList = useStoreState((state) => state.yearList)
  const selMapLocation = useStoreState((state) => state.selMapLocation)
  const useMapLocation = useStoreState((state) => state.useMapLocation)

  const [selYear, setSelYear] = useState<number>(yearFilter)
  const [selRisk, setSelRisk] = useState<string>(RISK_TYPES[0])
  const [useAllDataTooltip, setUseAllDataTooltip] = useState<boolean>(false)
  const [open1, setOpen1] = useState<boolean>(false)
  const [open2, setOpen2] = useState<boolean>(false)

  const click = () => {
    if (open1) {
      setOpen1(!open1)
    }
    if (open2) {
      setOpen2(!open2)
    }
  }

  useEffect(() => {
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  })

  useData()

  useEffect(() => {
    if (!yearFilter && yearList.length) {
      update({ yearFilter:  yearList[0] })
    }
  }, [yearFilter, yearList, update])

  useEffect(() => {
    if (selYear !== yearFilter) {
      setSelYear(yearFilter)
    }
  }, [selYear,yearFilter, setSelYear])

  useEffect(() => {
    if (selMapLocation && useMapLocation) {
      update({ chartAggKey: LAT_LON, chartAggVal: selMapLocation[LAT_LON] })
    }
  }, [selMapLocation, useMapLocation, update])

  const metricKeys = useMemo(() => useAllDataTooltip ?
    ['lat', 'lon', ...RISK_TYPES] :
    [selRisk],
  [useAllDataTooltip, selRisk])

  return (
    <>
      {filteredMapData?.length > 0  && yearFilter &&
        <div>
          <div className='absolute z-100 flex content-center gap-1'>
            <DropdownSelect
              data={yearList}
              valKey={selYear}
              label={YEAR}
              onClick={() => setOpen1(!open1)}
              onSelect={(val: number) => {
                setOpen1(!open1)
                update({ yearFilter: val })
              }}
              open={open1}
            />
            <DropdownSelect
              data={RISK_TYPES}
              valKey={selRisk}
              label='Select Risk Type'
              onClick={() => setOpen2(!open2)}
              onSelect={(val: string) => {
                setOpen2(!open2)
                setSelRisk(val)
              }}
              open={open2}
            />
            <Switch
              label='Tooltip - all Data'
              onChange={() => setUseAllDataTooltip(!useAllDataTooltip)}
              disabled={false}
              // onHover={() => {}}
            />
          </div>
          <div className={styles['map-container']}>
            <QLReportMap
              reportData={filteredMapData}
              showTooltip={true}
              fillBasedOn={selRisk}
              fillColors={['#09d65b', '#EFEE07', '#f00707']}
              getRadius={5}
              onClick={(obj: any) => update({ selMapLocation: obj })}
              showLegend={true}
              opacity={.5}
              tooltipKeys={{
                tooltipTitle1: 'Asset Name',
                tooltipTitle2: 'Business Category',
                metricKeys,
              }}
              formatDataKey={(el: string) => {
                if (el === 'lat') {
                  return 'Latitude'
                }
                if (el === 'lon') {
                  return 'Longitude'
                }
                return el
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
