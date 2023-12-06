import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export interface DropDownItem {
    name: string;
    value: string;
}

export interface DropDownProps {
    items: DropDownItem[];
    selectedItem : DropDownItem;
    setSelectedItem : (item: DropDownItem) => void;
}


export default function DropDown( { items, selectedItem, setSelectedItem } : DropDownProps) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 bg-darkgray px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm hover:bg-midgray">
                    {selectedItem.name}
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-300" aria-hidden="true" />
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
                            <Menu.Item key={item.value}>
                                {({ active }) => (
                                    <span
                                        className={classNames(
                                            active ? 'bg-midgray' : '',
                                            'block px-4 py-2 text-sm text-gray-300 cursor-pointer'
                                        )}
                                        onClick={() => setSelectedItem(item)}
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
