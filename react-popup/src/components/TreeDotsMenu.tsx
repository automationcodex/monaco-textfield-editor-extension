import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export interface TreeDotsMenuItem {
    name: string;
    title?: string;
    onClick: () => void;
}

export interface ThreeDotsMenuProps {
    items: TreeDotsMenuItem[];
}


export default function ThreeDotsMenu({ items }: ThreeDotsMenuProps) {
    return (
        <Menu as="div" className="relative inline-block text-left shrink-0">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 bg-darkgray  py-2 text-sm font-semibold text-gray-300 shadow-sm hover:bg-midgray">
                    <EllipsisVerticalIcon className='text-gray-300 h-5 w-5 my-auto mx-2' />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 bottom-0 z-10 mb-9 w-56 origin-bottom-right rounded-md bg-darkgray shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">

                        {items.map((item) => (
                            <Menu.Item key={item.name}>
                                {({ active }) => (
                                    <span
                                        title={item.title}
                                        className={classNames(
                                            active ? 'bg-midgray' : '',
                                            'block px-4 py-2 text-sm text-gray-300 cursor-pointer'
                                        )}
                                        onClick={() => item.onClick()}
                                    >
                                        {item.name}
                                    </span>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
