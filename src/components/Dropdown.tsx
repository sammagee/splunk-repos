import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Dispatch, Fragment, FunctionComponent, SetStateAction } from 'react'

interface DropdownOption {
  label: string
  value: any
}

interface DropdownProps {
  label?: string
  options: DropdownOption[]
  value: any
  setValue: Dispatch<SetStateAction<any>>
}

const Dropdown: FunctionComponent<DropdownProps> = ({
  label,
  options,
  value,
  setValue,
}) => {
  return (
    <div className="w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center space-x-1 justify-center w-full text-sm text-gray-600 hover:text-gray-900">
            <span>{label}</span>

            <span className="inline-block w-0 h-0 align-middle border-t-4 border-l-4 border-r-4 border-t-current border-l-transparent border-r-transparent" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 -translate-y-1"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 -translate-y-1"
        >
          <Menu.Items className="overflow-hidden shadow-sm absolute right-0 w-56 origin-top-right bg-white divide-y divide-gray-300 rounded-md border-gray-300 border focus:outline-none">
            {options.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    className={clsx(
                      active && 'bg-gray-50',
                      value === option.value
                        ? 'font-medium text-gray-900'
                        : 'text-gray-800',
                      'group flex items-center w-full px-2 py-2 text-xs'
                    )}
                    onClick={() => setValue(option.value)}
                  >
                    {value === option.value ? (
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="inline-block h-4 w-4 mr-2" />
                    )}

                    <span>{option.label}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default Dropdown
