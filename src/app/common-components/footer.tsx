import Link from 'next/link'


const Footer = () => (
  <div className='footer fixed bottom-0 w-full h-10 bg-[#A8A8A8] opacity-40 flex flex-row flex-wrap items-center font-bold color-black gap-2'>
    <div className='h-full ml-10 opacity-100  flex items-center'>
      CREDITS:
    </div>
    <Link href='https://www.flaticon.com/free-icons/graph'>
        flaticon,
    </Link>
    <Link href='https://www.pexels.com/'>
        Pexels
    </Link>
  </div>
)

export default Footer
