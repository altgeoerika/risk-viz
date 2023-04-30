'use client'
import React, { useMemo } from 'react'

import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { useData } from '../../hooks'
import { useStoreState } from '../../store'


const MaterialReactTable = dynamic(
  () => import('material-react-table'),
  {
    ssr: false,
    loading: () => <>Loading...</>,
  },
)

const RiskTable = () => {
  const filteredMapData = useStoreState((state) => state.filteredMapData)
  const dataKeyTypes = useStoreState((state) => state.dataKeyTypes)

  useData()

  const columns = useMemo<object[]>(() => Object.keys(dataKeyTypes)
    .filter(el => el !== 'Risk Factors')
    .map(col => ({
      accessorKey: col,
      id: col,
      header: col,
      enableClickToCopy: true,
    })), [dataKeyTypes])

  return (
    <>
      {filteredMapData && columns.length > 0 &&
        <Card>
          <CardContent sx={{ backgroundColor: 'black' }}>
            <MaterialReactTable
              columns={columns}
              data={filteredMapData}
              enableColumnFilterModes
              enableColumnOrdering
              enableGrouping
              enablePinning
              enableRowSelection
              initialState={{ showColumnFilters: true, density: 'compact', pagination: { pageIndex: 0, pageSize: 5 } }}
              positionToolbarAlertBanner='bottom'
            />
          </CardContent>
        </Card>
      }
    </>
  )
}

export default RiskTable
