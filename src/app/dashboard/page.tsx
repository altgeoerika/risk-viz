'use client'
import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'


const RiskMap = dynamic(
  () => import('./risk-map'),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        animation='wave'
        variant='rectangular'
        width='47vw'
        height='45vh'
      />
    ),
  },
)

const RiskChart = dynamic(
  () => import('./risk-chart'),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        animation='wave'
        variant='rectangular'
        width='47vw'
        height='45vh'
      />
    ),
  },
)

const RiskTable = dynamic(
  () => import('./table'),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        animation='wave'
        variant='rectangular'
        width='95vw'
        height='40vh'
      />
    ),
  },
)

const Dashboard = () => {
  return (
    <Box sx={{ bgcolor: '#FFCB70', height: 'fit-content', padding: '1rem', marginTop: '5rem'  }}>
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <RiskMap/>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <RiskChart/>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <RiskTable/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Dashboard
