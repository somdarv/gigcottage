import { Phone } from 'lucide-react'
import React from 'react'
import { FaPhone } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";



export default function GetInTouch() {
    return (
        <div className='w-full flex flex-wrap gap-y-3 justify-around'>
            {/* contact */}
            <div className='flex items-center gap-x-3'>
                <FaPhone className='text-secondary text-base md:text-2xl ' />

                <div className='flex flex-wrap items-center gap-x-2'>
                    <button className='font-bold text-base md:text-3xl text-primary'><a href="tel:+2330257441441">025 744 1441</a></button>
                    <span className='text-primary font-bold text-base md:text-3xl'>|</span>
                    <button className='font-bold text-base md:text-3xl text-primary'><a href="tel:+2330200200054">020 020 0054</a></button>
                </div>
            </div>





            {/* location */}
            <div className='flex items-start md:items-center gap-x-3'>
                <HiLocationMarker className='text-base md:text-3xl text-secondary' />

                <div className='flex  items-center gap-x-2'>
                    <button target="_blank" className='font-bold text-base text-start md:text-3xl text-primary'><a href="https://www.google.com/maps/place/5%C2%B046'53.2%22N+0%C2%B007'36.1%22W/@5.7816124,-0.1266073,20.28z/data=!4m4!3m3!8m2!3d5.7814304!4d-0.1266897?entry=ttu&g_ep=EgoyMDI1MDIxOS4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D">Adenta-Dodowa Road (Malejor)</a></button>
                </div>
            </div>



        </div>
    )
}
