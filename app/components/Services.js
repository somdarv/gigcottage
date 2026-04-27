import React from 'react'

export default function Services() {

    const facilities = [
        { title: 'Garden', sub: '1,000 dinner setting sitting capacity' },
        { title: "Main Auditorium", sub: '800 + Theatre setting sitting capacity' },
        { title: "MINI HALL", sub: '100 Dinner setting sitting capacity' },
        { title: "Terrace", sub: '100 Dinner setting sitting capacity ' },
        { title: "CAR PARK", sub: '150+ Secured car park' },
    ];

    const services = [
        { name: 'Event Planning And Coordination' },
        { name: 'Setup and Decor' },
        { name: 'Catering (in-house chef available)' },

    ]

    return (
        <div className='flex flex-wrap items-start w-full'>
            {/* facilities */}
            <div className='w-full p-6 md:p-12 bg-primary2 md:w-1/2'>
                <div className='w-[80%] mx-auto'>
                    <p className='text-lg font-bold text-white uppercase'>Our Facilities</p>
                    <div className='w-full mt-3'>
                        <p className='text-4xl font-bold text-secondary'>Event Spaces</p>
                        <div className='bg-secondary w-[25%] mt-3 h-1'></div>
                    </div>


                    <div className='w-full '>
                        <div className='my-4 '>
                            {facilities.map((facility, index) => (
                                <div key={index} className='w-full my-8'>
                                    <div className='flex items-center gap-x-3'>
                                        <div className='w-4 h-4 bg-secondary'></div>
                                        <h1 className='text-2xl font-bold text-white uppercase'>{facility.title}</h1>
                                    </div>
                                    <p className='my-2 text-xl text-white'>{facility.sub}</p>
                                </div>
                            ))}

                        </div>
                    </div>


                </div>
            </div>




            {/* services */}
            <div className='w-full p-6 md:p-12 text-primary md:w-1/2'>
                <div className='w-[80%] mx-auto'>
                    <p className='text-lg font-bold uppercase text-gig-black'>Our Services</p>
                    <div className='w-full mt-3'>
                        <p className='text-4xl font-bold text-primary'>Services We Provide</p>
                        <div className='bg-secondary w-[25%] mt-3 h-1'></div>
                    </div>


                    <div className='my-4'>
                        {services.map((service, index) => (
                            <div key={index} className='w-full my-3'>
                                <div className='flex items-center gap-x-3'>
                                    <div className='w-4 h-1 bg-gig-black'></div>
                                    <h1 className='w-full my-2 text-2xl font-bold uppercase text-gig-black'>{service.name}</h1>
                                </div>
                                {/* <p className='my-2 text-xl text-white'>{facility.sub}</p> */}
                            </div>
                        ))}

                    </div>


                </div>
            </div>
        </div>
    )
}
