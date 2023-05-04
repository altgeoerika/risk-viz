'use client'
import React, { useMemo, useState, useEffect } from 'react'

import dynamic from 'next/dynamic'
import Plotly from 'plotly.js-basic-dist-min'
import createPlotlyComponent from 'react-plotly.js/factory'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

import { useData } from '../../hooks'
import { formatColName } from '../../utils/string-functions'
import { useStoreState, useStoreActions } from '../../store'
import { YEAR, LAT_LON, chartColors } from '../../constants'


const DropdownSelect = dynamic(
  () => import('../common-components/dropdown-select'),
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

const Plot = createPlotlyComponent(Plotly)

const layout = {
  autosize: true,
  margin: {
    l: 100,
    r: 50,
    b: 100,
    t: 50,
    pad: 4,
  },
  title: '',
  showlegend: true,
  xaxis: {
    title: {
      text: 'Year',
    },
  },
  yaxis: {
    title: {
      text: 'Risk Type Rating (mean)',
    },
  },
  yaxis2: {
    title: 'Risk Rating (mean)',
    overlaying: 'y',
    side: 'right',
  },
  legend: {
    orientation: 'v',
    x: 1.2,
    xanchor: 'left',
  },
}

const RiskChart = () => {
  const update = useStoreActions((action) => action.update)
  const chartAggKey = useStoreState((state) => state.chartAggKey)
  const chartAggVal = useStoreState((state) => state.chartAggVal)
  const dataAggKeys = useStoreState((state) => state.dataAggKeys)
  const aggKeyValues = useStoreState((state) => state.aggKeyValues)
  const yearList = useStoreState((state) => state.yearList)
  const chartData = useStoreState((state) => state.chartData)
  const selMapLocation = useStoreState((state) => state.selMapLocation)

  const [selectedAggVal, setSelectedAggVal] = useState<string>(chartAggVal)
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

  // set chartAggKey to the first option in the key list for aggregation
  useEffect(() => {
    if (!chartAggKey && dataAggKeys.length) {
      update({ chartAggKey: dataAggKeys[0] })
    }
  }, [chartAggKey, dataAggKeys, update])

  // update local state with the selected value
  useEffect(() => {
    if (chartAggVal && aggKeyValues.includes(chartAggVal)) {
      setSelectedAggVal(chartAggVal)
    }
  }, [chartAggVal, aggKeyValues])

  // update aggregation value with the first value in the aggregation avlue list when changing the aggregation key
  useEffect(() => {
    if (!aggKeyValues.includes(selectedAggVal)) {
      if (!(chartAggKey === LAT_LON && selMapLocation)) {
        update({ chartAggVal: aggKeyValues[0] })
        setSelectedAggVal(aggKeyValues[0])
      }
    }
  }, [chartAggKey, chartAggVal, aggKeyValues, selectedAggVal, update, selMapLocation])

  // set selChartLocation to the first agg value in the list the first time we change chartAggKey to lon / lat
  useEffect(() => {
    if (chartAggKey === LAT_LON && chartAggVal && !selMapLocation) {
      const [lat, lon] = chartAggVal.split(' / ')
      update({ selChartLocation: { lat: Number(lat), lon: Number(lon) } })
    }
  }, [chartAggKey, chartAggVal, selMapLocation, update])

  const traces = useMemo(() => {
    const { columns, values } = chartData || {}
    return columns.reduce((acc, col, i) => {
      const fomattedCol: string = formatColName(col)
      const colValues = values.map(list => list[i])
      if (![chartAggKey, YEAR, 'Risk Rating (mean)'].includes(col)) {
        return [
          ...acc,
          ({
            x: yearList,
            y: colValues,
            ...(col === 'Risk Rating_mean' ? { yaxis: 'y2' } : {}),
            ...(col !== 'Risk Rating_mean' ? { visible: 'legendonly' } : {}),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: chartColors[i] },
            name: fomattedCol,
            hovertemplate: '<b>Year</b>: %{x}' +
              `<br><b>${fomattedCol}</b>: %{y}<br>` +
              `<b>${chartAggKey}</b>: ${chartAggVal}` +
              '<extra></extra>',
            hoverinfo:'x+y',
          }),
        ]
      }
      return acc
    }, [])

  }, [chartData, chartAggKey, chartAggVal, yearList])

  return (
    <>
      {chartData && chartAggKey && (
        <Card>
          <CardActions sx={{
            backgroundColor: 'white',
            boxShadow: '0 0.125rem 0.5rem 0 rgba(12, 12, 13, 0.15)',
            position: 'sticky',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'justify-between',
            alignContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
            <div className='z-10'>
              <DropdownSelect
                data={dataAggKeys}
                valKey={chartAggKey}
                onClick={() => setOpen1(!open1)}
                onSelect={(val: string) => {
                  setOpen1(!open1)
                  update({ chartAggKey: val })
                  update({ selMapLocation: null  })
                }}
                label='Group Key'
                open={open1}
              />
            </div>
            <div>
              <DropdownSelect
                data={[...aggKeyValues]}
                valKey={selectedAggVal}
                onClick={() => setOpen2(!open2)}
                onSelect={(val: string) => {
                  setOpen2(!open2)
                  setSelectedAggVal(val)
                  update({ chartAggVal: val })
                  update({ selMapLocation: null  })
                  if (chartAggKey === LAT_LON) {
                    const [lat, lon] = val.split(' / ')
                    update({ selChartLocation: { lat: Number(lat), lon: Number(lon) } })
                  }
                }}
                label='Group Value'
                open={open2}
              />
            </div>
          </CardActions>
          <CardContent>
            <div style={{ width: '100%', height: '40vh' }}>
              <Plot
                data={traces}
                hoverInfo='x+text+name'
                layout={layout}
                config={{
                  displayModeBar: false,
                  responsive: true,
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default RiskChart
