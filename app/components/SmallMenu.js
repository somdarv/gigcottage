import React from 'react'

export default function SmallMenu() {
    return (
        <div className='w-full flex items-center justify-around'>
            <p className='text-primary font-regular text-xl md:text-2xl'>Our Facilities</p>
            <span className='text-secondary font-semibold '>|</span>
            <p className='text-primary font-regular text-xl md:text-2xl'>Our Services</p>
        </div>
    )
}
