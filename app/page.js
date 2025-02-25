'use client'
import Image from 'next/image'
import React from 'react'
import GetInTouch from './components/GetInTouch'
import { FaPhone, FaWhatsapp } from 'react-icons/fa6'; // Import WhatsApp icon
import SmallMenu from './components/SmallMenu';
import Services from './components/Services';



export default function page() {

  const whatsappNumber = '+233257441441'; // Replace with your WhatsApp number
  const whatsappMessage = 'Hello, I am interested in your event services.'; // Optional message

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };


  return (
    <div className=' w-full '>
      <div className='w-full pt-8 flex items-center justify-center'>
        <Image
          src={'/giglogopalm.webp'}
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

      <div className='w-[80%] md:w-[25%] my-8 mx-auto'>
        <SmallMenu />
      </div>


      <div className='w-full'>
        <Services />
      </div>

      <div className="fixed bottom-20 right-24 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg cursor-pointer z-50" onClick={handleWhatsAppClick}>
        <FaWhatsapp className="text-6xl" />
      </div>


    </div>
  )
}
