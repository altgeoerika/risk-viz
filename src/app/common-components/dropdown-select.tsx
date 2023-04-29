// ref: https://headlessui.com/react/menu
'use client'
import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


const DropdownSelect = ({ data, onSelect, valKey, label, classes={ container: '' } }) => {
  const [selectedValue, setSelectedValue] = useState(valKey)

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
          <Menu.Button className='inline-flex w-full justify-center rounded bg-gray-500 p-1 text-sm font-medium text-white hover:bg-opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-90'>
            {selectedValue}
            <ChevronDownIcon
              className='ml-2 -mr-1 h-4 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items
            className='menu-items absolute left-0 origin-top-right divide-y max-h-60 divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto'
            // static
          >
            <div className='px-1 py-1 '>
              {data.map((val, i) =>(
                <Menu.Item key={i}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded p-1 text-sm`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setSelectedValue(val)
                        onSelect(val)
                      }}
                    >
                      {val}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}


export default DropdownSelect
