'use client'
import React from 'react'
import Plotly from 'plotly.js-basic-dist-min'
import createPlotlyComponent from 'react-plotly.js/factory'


const Plot = createPlotlyComponent(Plotly)


const RiskChart = () => {
  return (
    <Plot
      data={[
        {
          x: [1, 2, 3],
          y: [2, 6, 3],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
        },
        { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
      ]}
      layout={ { width: '50wv', height: '50hv', title: 'A Fancy Plot' } }
      useResizeHandler
      className='w-full h-full'
    />
  )
}

export default RiskChart
