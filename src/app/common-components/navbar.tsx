import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

// "https://www.flaticon.com/free-icons/graph"
import logo from '../../assets/images/logo.png'


const Navbar = () => {
  return (
    <div className='navbar sticky top-o bg-black flex flex-row justify-between h-20 text-xl content-center'>
      <div className='navbar-start ml-10 flex content-center items-center gap-2 text-white'>
        <Link href='https://www.flaticon.com/free-icons/graph'>
          <Image alt='Image logo' src={logo} placeholder='blur' width={40} height={40} quality={80}/>
        </Link>
        <div className='font-bold'>Risk Data Analysis</div>
        <span>@geoerika</span>
      </div>
      <div className='navbar-end mr-10 flex flex row gap-4 content-center items-center text-[#fcb900]'>
        <Link href='/'>Home</Link>
        <Link href='/dashboard'>Dashboard</Link>
      </div>
    </div>
  )
}
export default Navbar
