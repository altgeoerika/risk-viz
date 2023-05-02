'use client'
import Link from 'next/link'
import { Box } from '@mui/material'


const Home = () => (
  <Box sx={{ bgcolor: '#FFCB70', height: 'fit-content', padding: '1rem', marginTop: '5rem'  }}>
    <div>Home Test</div>
    <Link href='/dashboard'>Risk Data Dashboard</Link>
  </Box>
)

export default Home
