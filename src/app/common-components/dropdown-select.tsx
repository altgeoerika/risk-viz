// ref: https://headlessui.com/react/menu
'use client'
import { useEffect, useState } from 'react'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


const DropdownSelect = ({ data, onSelect, onClick, open, valKey, label, classes={ container: '' } }) => {
  const [selectedValue, setSelectedValue] = useState(valKey)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (valKey) {
      setSelectedValue(valKey)
    }
  }, [valKey, setSelectedValue])

  return (
    <div className={
      classes?.container ?
        classes.container :
        'relative top-2 left-2 fit text-right flex items-center bg-white p-1.5 rounded drop-shadow-sm'
    }>
      <div className='mr-2 text-sm'>{label}:</div>
      <Menu as='menu' className='relative block text-left min-w-max'>
        <div>
          <Menu.Button
            className='inline-flex w-full justify-center rounded bg-gray-500 p-1 text-xs font-medium text-white hover:bg-opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-90'
            onClick={(onClick)}
          >
            {selectedValue}
            <ChevronDownIcon
              className='ml-2 -mr-1 h-4 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
        </div>
        {open && (
          <Menu.Items
            static
            className='menu-items absolute left-0 origin-top-right divide-y divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-48'
          >
            <div className='px-1 py-1 '>
              {data.map((val: (string | number), i: number) =>(
                <Menu.Item key={i}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-500 text-white' : selected === i ? 'bg-gray-300' : 'text-gray-900'
                      } group flex w-full items-center rounded p-1 text-xs`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedValue(val)
                        onSelect(val)
                        setSelected(i)
                      }}
                    >
                      {val}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        )}
      </Menu>
    </div>
  )
}


export default DropdownSelect
