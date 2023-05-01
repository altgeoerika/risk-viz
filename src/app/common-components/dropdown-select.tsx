// ref: https://headlessui.com/react/menu
'use client'
import { useEffect, useState } from 'react'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


const DropdownSelect = ({ data, onSelect, onClick, open, valKey, label, classes={ menu: '' } }) => {
  const [selectedValue, setSelectedValue] = useState(valKey)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (valKey) {
      setSelectedValue(valKey)
    }
  }, [valKey, setSelectedValue])

  return (
    <div className='relative top-2 fit left-2 text-right flex items-center bg-white p-1.5 rounded drop-shadow-sm'>
      <div className='mr-2 text-sm fit'>{label}:</div>
      <Menu as='menu' className={`${classes?.menu ||''} relative block text-left w-max`}>
        <div>
          <Menu.Button
            className='inline-flex w-full justify-center rounded bg-gray-500 p-2 text-sm font-medium text-white hover:bg-opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-90'
            onClick={(onClick)}
          >
            {selectedValue}
            <ChevronDownIcon
              className='ml-2 -mr-1 h-4 w-5'
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
                      } group flex w-full items-center text-left rounded p-1 text-sm`}
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
