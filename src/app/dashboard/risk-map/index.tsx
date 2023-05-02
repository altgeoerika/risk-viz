'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import { QLReportMap } from '@geoerika/react-maps'

import { useData } from '../../../hooks'
import { useStoreState, useStoreActions } from '../../../store'
import { YEAR, LAT_LON } from '../../../constants'
import styles from './map.module.scss'


const DropdownSelect = dynamic(
  () => import('../../common-components/dropdown-select'),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        animation='wave'
        variant='rectangular'
        width='13vw'
        height='5vh'
      />
    ),
  },
)

const Switch = dynamic(
  () => import('../../common-components/switch'),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        animation='wave'
        variant='rectangular'
        width='13vw'
        height='4vh'
      />
    ),
  },
)

const RiskMap = () => {
  const update = useStoreActions((action) => action.update)
  const filteredMapData = useStoreState((state) => state.filteredMapData)
  const yearFilter = useStoreState((state) => state.yearFilter)
  const yearList = useStoreState((state) => state.yearList)
  const numericKeyList = useStoreState((state) => state.numericKeyList)
  const riskRatingKeys = useStoreState((state) => state.riskRatingKeys)
  const selMapLocation = useStoreState((state) => state.selMapLocation)
  const useMapLocation = useStoreState((state) => state.useMapLocation)

  const [selYear, setSelYear] = useState<number>(yearFilter)
  const [selRisk, setSelRisk] = useState<string>(riskRatingKeys[0])
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
    if (!selRisk && riskRatingKeys.length) {
      setSelRisk(riskRatingKeys[0])
    }
  }, [selRisk, riskRatingKeys])

  useEffect(() => {
    if (selMapLocation && useMapLocation) {
      update({ chartAggKey: LAT_LON, chartAggVal: selMapLocation[LAT_LON] })
    }
  }, [selMapLocation, useMapLocation, update])

  const metricKeys = useMemo(() => useAllDataTooltip ?
    numericKeyList :
    [selRisk],
  [useAllDataTooltip, selRisk, numericKeyList])

  return (
    <>
      {filteredMapData?.length > 0 && yearFilter && riskRatingKeys.length > 0 &&
        <Card>
          <CardActions sx={{
            backgroundColor: 'white',
            position: 'sticky',
            zIndex: 100 , display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'justify-between',
            alignContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
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
              data={riskRatingKeys}
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
            />
          </CardActions>
          <CardContent sx={{ zIndex: -100 }}>
            <div className={styles['map-container']}>
              <QLReportMap
                reportData={filteredMapData}
                showTooltip={true}
                fillBasedOn={selRisk}
                fillColors={['#09d65b', '#EFEE07', '#f00707']}
                getRadius={6}
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
          </CardContent>
        </Card>
      }
    </>
  )
}

export default RiskMap
