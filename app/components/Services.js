import React from 'react'

export default function Services() {

    const facilities = [
        { title: 'grounds', sub: '800+ dinner setting sitting capacity' },
        { title: "EDITH'S HALL", sub: '800 + Theatre setting sitting capacity' },
        { title: "PALACE HALL", sub: '100+ Theatre setting sitting capacity' },
        { title: "CAR PARK", sub: '100+ Secured car park' },
    ];

    const services = [
        { name: 'food' },
        { name: 'Event Setup' },
        { name: 'Decor' },
        { name: 'Fresh Natural Flowers' },
    ]

    return (
        <div className='w-full flex flex-wrap items-start'>
            {/* facilities */}
            <div className='w-full p-6 md:p-12   bg-primary2 md:w-1/2'>
                <div className='w-[80%] mx-auto'>
                    <p className='uppercase text-white font-bold text-lg'>Our Facilities</p>
                    <div className='w-full mt-3'>
                        <p className='text-secondary text-4xl font-bold'>Event Spaces</p>
                        <div className='bg-secondary w-[25%] mt-3 h-1'></div>
                    </div>


                    <div className='w-full '>
                        <div className='my-4 '>
                            {facilities.map((facility, index) => (
                                <div key={index} className='w-full my-8'>
                                    <div className='flex items-center gap-x-3'>
                                        <div className='bg-secondary w-4 h-4'></div>
                                        <h1 className='font-bold text-2xl uppercase text-white'>{facility.title}</h1>
                                    </div>
                                    <p className='text-white text-xl my-2'>{facility.sub}</p>
                                </div>
                            ))}

                        </div>
                    </div>


                </div>
            </div>




            {/* services */}
            <div className='w-full p-6 md:p-12 text-primary md:w-1/2'>
                <div className='w-[80%] mx-auto'>
                    <p className='uppercase text-gig-black font-bold text-lg'>Our Services</p>
                    <div className='w-full mt-3'>
                        <p className='text-primary text-4xl font-bold'>Services We Provide</p>
                        <div className='bg-secondary w-[25%] mt-3 h-1'></div>
                    </div>


                    <div className='my-4'>
                        {services.map((service, index) => (
                            <div key={index} className='w-full my-3'>
                                <div className='flex items-center gap-x-3'>
                                    <div className='bg-gig-black w-4 h-1'></div>
                                    <h1 className='font-bold text-2xl uppercase text-gig-black'>{service.name}</h1>
                                </div>
                                {/* <p className='text-white text-xl my-2'>{facility.sub}</p> */}
                            </div>
                        ))}

                    </div>


                </div>
            </div>
        </div>
    )
}
