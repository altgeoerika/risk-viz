'use client'
import React, { useMemo, useState, useEffect } from 'react'

import dynamic from 'next/dynamic'
import Plotly from 'plotly.js-basic-dist-min'
import createPlotlyComponent from 'react-plotly.js/factory'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'

import { useData } from '../../../hooks'
import { formatColName } from '../../../utils/string-functions'
import { useStoreState, useStoreActions } from '../../../store'
import { YEAR, colors } from '../../../constants'


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

const Plot = createPlotlyComponent(Plotly)

const RiskChart = () => {
  const update = useStoreActions((action) => action.update)
  const chartAggKey = useStoreState((state) => state.chartAggKey)
  const chartAggVal = useStoreState((state) => state.chartAggVal)
  const dataAggKeys = useStoreState((state) => state.dataAggKeys)
  const aggKeyValues = useStoreState((state) => state.aggKeyValues)
  const yearList = useStoreState((state) => state.yearList)
  const chartData = useStoreState((state) => state.chartData)
  const useMapLocation = useStoreState((state) => state.useMapLocation)

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

  useEffect(() => {
    if (!chartAggKey && dataAggKeys.length) {
      update({ chartAggKey: dataAggKeys[0] })
    }
  }, [chartAggKey, dataAggKeys, update])

  useEffect(() => {
    if (!aggKeyValues.includes(selectedAggVal)) {
      update({ chartAggVal: aggKeyValues[0] })
      setSelectedAggVal(aggKeyValues[0])
    }
  }, [chartAggVal, aggKeyValues, selectedAggVal, update])

  const traces = useMemo(() => {
    const { columns, values } = chartData || {}
    return columns.reduce((acc, col, i) => {
      if (![chartAggKey, YEAR].includes(col)) {
        const fomattedCol: string = formatColName(col)
        const colValues = values.map(list => list[i])
        return [
          ...acc,
          ({
            x: yearList,
            y: colValues,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: colors[i] },
            name: fomattedCol,
            hovertemplate: '<b>Year</b>: %{x}' + `<br><b>${fomattedCol}</b>: %{y}<br>` + `<b>${chartAggKey}</b>: ${chartAggVal}` + '<extra></extra>',
            hoverinfo:'x+y',
          }),
        ]
      }
      return acc
    }, [])

  }, [chartData, chartAggKey, chartAggVal, yearList])

  return chartData && chartAggKey && (
    <Card sx={{ backgroundColor: 'black' }}>
      <CardActions sx={{ backgroundColor: 'white', position: 'sticky', zIndex: 100 , display: 'flex', justifyContent: 'justify-between', alignItems: 'center', width: '100%' }}>
        <DropdownSelect
          data={dataAggKeys}
          valKey={chartAggKey}
          onClick={() => setOpen1(!open1)}
          onSelect={(val: string) => {
            setOpen1(!open1)
            update({ chartAggKey: val })
          }}
          label='Group Key'
          open={open1}
          classes={{ menu: 'min-w-140' }}
        />
        <DropdownSelect
          data={[...aggKeyValues]}
          valKey={selectedAggVal}
          onClick={() => setOpen2(!open2)}
          onSelect={(val: string) => {
            setOpen2(!open2)
            setSelectedAggVal(val)
            update({ chartAggVal: val })
          }}
          label='Group Value'
          open={open2}
          classes={{ menu: 'min-w-200' }}
        />
        <Switch
          label='Use Location on Map'
          onChange={() => update({ useMapLocation: !useMapLocation })}
          disabled={false}
          onHover={() => {}}
        />
      </CardActions>
      <CardContent>
        <div style={{ width: '100%', height: '40vh' }}>
          <Plot
            data={traces}
            hoverInfo='x+text+name'
            layout={{
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
                  font: {
                    // family: 'Courier New, monospace',
                    // size: 18,
                    // color: '#7f7f7f',
                  },
                },
              },
              yaxis: {
                title: {
                  text: 'Risk values',
                  font: {
                    // family: 'Courier New, monospace',
                    // size: 18,
                    // color: '#7f7f7f'
                  },
                },
              },
            }}
            config={{
              displayModeBar: false,
              responsive: true,
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default RiskChart
