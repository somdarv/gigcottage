import Image from 'next/image'
import React from 'react'
import GetInTouch from './components/GetInTouch'
import { FaPhone } from "react-icons/fa6";
import SmallMenu from './components/SmallMenu';
import Services from './components/Services';



export default function page() {
  return (
    <div className=' w-full '>
      <div className='w-full pt-8 flex items-center justify-center'>
        <Image
          src={'/giglogo.png'}
          width={1081}
          height={630}
          className='w-[90%] md:w-[50%] mx-auto'
          alt='gigcottage logo'
          priority={true} // Preload for above-the-fold images
          // placeholder='blur' // Add blur-up placeholder
          quality={85} // Optimal quality balance
          sizes='(max-width: 768px) 100vw, 60vw' // Responsive sizing hints
          style={{
            objectFit: 'contain', // Ensure proper aspect ratio
          }} />
      </div>

      <h1 className='text-primary text-2xl md:text-4xl font-semibold w-[80%] mx-auto text-center my-8 md:my-12'>The Complete Event Center</h1>


      <div className=' w-[90%]   md:w-[70%] mx-auto'>
        <GetInTouch />
      </div>

      {/* small menu */}
      <div className='w-[80%] md:w-[25%] my-8 mx-auto'>
        <SmallMenu />
      </div>


      <div className='w-full'>
        <Services />
      </div>




    </div>
  )
}
