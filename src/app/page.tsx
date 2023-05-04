'use client'
import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid/Grid'

import Footer from '../app/common-components/footer'
import RiskHome from '../assets/images/risk_home.jpg'


const Home = () => (
  <div className='h-full w-100'>
    <Box sx={{ bgcolor: '#FFCB70', height: 'fit-content', padding: '1rem', marginTop: '5rem'  }}>
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <Container sx={{ width: '50vw', height: '50vw', marginTop: '2rem', borderRadius: '10%' }}>
              <Image
                alt=''
                src={RiskHome}
                placeholder='blur'
                quality={80}
                className='rounded cursor-pointer'
              />
            </Container>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}
            sx={
              {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4rem',
              }
            }>
            <div className='text-6xl text-center'>
              Welcome to our risk assessment dashboard.
            </div>
            <div className='text-2xl text-center'>
              Make informed decisions to keep your business safe and secure from climate and other natural hazards.
            </div>
            <Link
              href='/dashboard'
              className='text-2xl font-extrabold tracking-wider bg-black uppercase text-white rounded p-4'
            >
                analyse risk
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
    <Footer />
  </div>
)

export default Home
