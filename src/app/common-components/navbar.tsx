//ref: https://www.youtube.com/watch?v=8s4DK5PkRNQ
'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import CloseIcon from '@mui/icons-material/Close'

// "https://www.flaticon.com/free-icons/graph"
import logo from '../../assets/images/logo.png'


const linkStyling = 'text-[#fcb900] uppercase font-bold hover:border-b cursor-pointer'

const Navbar = () => {
  const [navMenuOpen, setNavMenuOpen] = useState(false)

  const handleNav = () => {
    setNavMenuOpen(!navMenuOpen)
  }
  return (
    <nav className='navbar fixed top-0 shadow-md bg-black w-full h-20'>
      <div className='w-full h-full flex justify-between text-xl items-center px-10 2xl:px-16'>
        <div className='nav-header flex items-center gap-2 text-white'>
          <Link href='./'>
            <Image
              alt='Image logo'
              src={logo}
              placeholder='blur'
              width={40}
              height={40}
              quality={80}
              className='cursor-pointer'
            />
          </Link>
          <div className='font-bold'>Risk Data Analysis</div>
          <span className='xs:hidden sm:flex'>@geoerika</span>
        </div>
        <div className='nav-end xs:hidden sm:flex'>
          <ul className='xs:hidden sm:flex'>
            <Link href='/'>
              <li className={`ml-10 ${linkStyling}`}>
                Home
              </li>
            </Link>
            <Link href='/dashboard'>
              <li className={`ml-10 ${linkStyling}`}>
                Dashboard
              </li>
            </Link>
          </ul>
        </div>
        <div onClick={handleNav} className='sm:hidden cursor-pointer pl-24'>
          <MenuOpenIcon sx={{ color: 'white', fontSize: 40 }}/>
        </div>
        <div className={navMenuOpen ?
          'fixed top-0 left-0 w-[65%] sm:hidden h-screen bg-white p-10 ease-in duration-500' :
          'fixed left-[-100%] top-o p-10 ease-in durtion-500'}
        >
          <div className='flex-col w-full items-center justify-end'>
            <div className='flex justify-end'>
              <CloseIcon onClick={handleNav} className='cursor-pointer'/>
            </div>
            <div className='flex-col py-4 gap-4'>
              <ul>
                <Link href='/'>
                  <li className={`py-4 ${linkStyling}`}>
                    Home
                  </li>
                </Link>
                <Link href='/dashboard'>
                  <li className={`py-4 ${linkStyling}`}>
                    Dashboard
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
