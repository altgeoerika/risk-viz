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
        width='10vw'
        height='4vh'
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
        width='10vw'
        height='4vh'
      />
    ),
  },
)

const Button = dynamic(
  () => import('../../common-components/button'),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        animation='wave'
        variant='rectangular'
        width='10vw'
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
  const selChartLocation = useStoreState((state) => state.selChartLocation)

  const [selYear, setSelYear] = useState<number>(yearFilter)
  const [selRisk, setSelRisk] = useState<string>(riskRatingKeys[0])
  const [useAllDataTooltip, setUseAllDataTooltip] = useState<boolean>(false)
  const [open1, setOpen1] = useState<boolean>(false)
  const [open2, setOpen2] = useState<boolean>(false)
  // prop to reset map view to data extent
  const [resetMapView, setResetMapView] = useState<boolean>(false)

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
    if (selMapLocation) {
      update({ chartAggKey: LAT_LON, chartAggVal: selMapLocation[LAT_LON] })
    }
  }, [selMapLocation, update])

  const metricKeys = useMemo(() => useAllDataTooltip ?
    numericKeyList :
    [selRisk],
  [useAllDataTooltip, selRisk, numericKeyList])

  return (
    <div className='w-full'>
      {filteredMapData?.length > 0 && yearFilter && riskRatingKeys.length > 0 &&
        <Card>
          <CardActions sx={{
            backgroundColor: 'white',
            boxShadow: '0 0.125rem 0.5rem 0 rgba(12, 12, 13, 0.15)',
            position: 'sticky',
            flexWrap: 'wrap',
            alignContent: 'center',
            alignItems: 'center',
            zIndex: 1,
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
            <div className={styles['select-container']}>
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
            </div>
            <div className='-z-10'>
              <Button
                onClick={() => setResetMapView(true)}
              >
                 Reset Map View
              </Button>
            </div>
            <div className='-z-10 p-2'>
              <Switch
                label='Tooltip - all Data'
                onChange={() => setUseAllDataTooltip(!useAllDataTooltip)}
                disabled={false}
              />
            </div>
          </CardActions>
          <CardContent>
            <div className={styles['map-container']}>
              <QLReportMap
                reportData={filteredMapData}
                showTooltip={true}
                fillBasedOn={selRisk}
                fillColors={['#09d65b', '#EFEE07', '#f00707']}
                getRadius={6}
                onClick={(obj: any) => {
                  const { lon, lat } = obj || {}
                  if (lon && lat) {
                    update({
                      chartAggKey: LAT_LON,
                      chartAggVal: `${lat} / ${lon}`,
                    })
                  }
                  update({ selMapLocation: obj })
                }}
                selectedPOI={selChartLocation}
                resetMapView={resetMapView}
                setResetMapView={setResetMapView}
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
                controller={{
                  scrollZoom: false,
                  doubleClickZoom: true,
                }}
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
              />
            </div>
          </CardContent>
        </Card>
      }
    </div>
  )
}

export default RiskMap
