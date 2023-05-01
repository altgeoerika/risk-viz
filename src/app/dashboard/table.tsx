// ref: https://www.material-react-table.com/docs/examples/advanced
//      https://www.material-react-table.com/docs/examples/data-export
'use client'
import React, { useMemo } from 'react'

import dynamic from 'next/dynamic'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { ExportToCsv } from 'export-to-csv'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import Skeleton from '@mui/material/Skeleton'

import { useData } from '../../hooks'
import { useStoreState } from '../../store'
import { RiskData } from '../../store/types'


const MaterialReactTable = dynamic(
  () => import('material-react-table'),
  {
    ssr: false,
    loading: () => <>Loading...</>,
  },
)

const Button = dynamic(
  () => import('../common-components/button'),
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
      ...( dataKeyTypes[col] === 'string' &&
        { columnFilterModeOptions: ['fuzzy', 'contains', 'startsWith', 'endsWith', 'equals', 'notEquals', 'empty', 'notEmpty'] }
      ),
    })), [dataKeyTypes])

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)

  const handleExportData = () => {
    csvExporter.generateCsv(filteredMapData)
  }

  const handleExportRows = (rows: RiskData) => {
    csvExporter.generateCsv(rows.map((row) => row.original))
  }

  return (
    <>
      {filteredMapData && columns.length > 0 &&
        <Card>
          <CardContent sx={{ backgroundColor: 'black' }}>
            <MaterialReactTable
              fontFamily='Oxygen'
              columns={columns}
              data={filteredMapData}
              enableColumnFilterModes
              enableColumnOrdering
              enableGrouping
              enablePinning
              enableRowActions
              enableRowSelection
              muiTableHeadCellProps={{
                //simple styling with the `sx` prop, works just like a style prop in this example
                sx: {
                  fontWeight: 'bold',
                  fontSize: '14px',
                },
              }}
              initialState={{ showColumnFilters: true, density: 'compact', pagination: { pageIndex: 0, pageSize: 5 } }}
              positionToolbarAlertBanner='bottom'
              muiTableHeadCellFilterTextFieldProps={{
                sx: { width: '100%' },
                size: 'small',
              }}
              renderTopToolbarCustomActions={({ table }) => (
                <Box
                  sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                >
                  <Button
                    onClick={handleExportData}
                    icon={<FileDownloadIcon />}
                    disabled={false}
                  >
                    Export All Data
                  </Button>
                  <Button
                    disabled={
                      !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    //only export selected rows
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    icon={<FileDownloadIcon />}
                  >
                    Export Selected Rows
                  </Button>
                </Box>
              )}
            />
          </CardContent>
        </Card>
      }
    </>
  )
}

export default RiskTable
