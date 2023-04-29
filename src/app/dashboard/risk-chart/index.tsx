'use client'
import React, { useMemo, useState, useEffect } from 'react'
import Plotly from 'plotly.js-basic-dist-min'
import createPlotlyComponent from 'react-plotly.js/factory'

import DropdownSelect from '../../common-components/dropdown-select'
import { formatColName } from '../../../utils/string-functions'
import { useStoreState, useStoreActions } from '../../../store'
import { useData } from '../../../hooks'
import { YEAR, colors } from '../../../constants'


const Plot = createPlotlyComponent(Plotly)

const RiskChart = () => {
  const update = useStoreActions((action) => action.update)
  const chartAggKey = useStoreState((state) => state.chartAggKey)
  const chartAggVal = useStoreState((state) => state.chartAggVal)
  const dataAggKeys = useStoreState((state) => state.dataAggKeys)
  const aggKeyValues = useStoreState((state) => state.aggKeyValues)
  const yearList = useStoreState((state) => state.yearList)
  const chartData = useStoreState((state) => state.chartData)

  const [selectedAggVal, setSelectedAggVal] = useState(chartAggVal)

  useData()

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
        const colValues = values.map(list => list[i])
        return [
          ...acc,
          ({
            x: yearList,
            y: colValues,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: colors[i] },
            name: formatColName(col),
          }),
        ]
      }
      return acc
    }, [])

  }, [chartData, chartAggKey, yearList])

  return chartData && (
    <>
      <div className='absolute z-100 flex items-start gap-1'>
        <div>
          <DropdownSelect
            data={dataAggKeys}
            valKey={chartAggKey}
            onSelect={(val: string) => {
              update({ chartAggKey: val })
            }}
            label='Group Key'
          />
        </div>
        <div>
          <DropdownSelect
            data={[...aggKeyValues]}
            valKey={selectedAggVal}
            onSelect={(val: string) => {
              setSelectedAggVal(val)
              update({ chartAggVal: val })
            }}
            label='Group Value'
          />
        </div>
      </div>
      <div>
        <Plot
          data={traces}
          layout={ { width: '20wv', height: '20hv', title: '', showlegend: true } }
          useResizeHandler
          className='w-full h-full'
          config={{
            displayModeBar: false,
            responsive: true,
          }}
        />
      </div>
    </>
  )
}

export default RiskChart
