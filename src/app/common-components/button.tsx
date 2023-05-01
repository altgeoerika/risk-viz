'use client'
import { ReactNode } from 'react'


type ButtonProps = {
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}

const Button = ({ icon, onClick, disabled, children }: ButtonProps) => (
  <button
    className={`hover:bg-gray-400 text-white py-2 px-3 rounded inline-flex items-center text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-90 
    ${disabled ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-gray-500'}`
    }
    onClick={onClick}
  >
    {icon}
    {children}
  </button>
)

export default Button
