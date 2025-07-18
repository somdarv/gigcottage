'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import GetInTouch from './components/GetInTouch'
import { FaPhone, FaWhatsapp } from 'react-icons/fa6'; // Import WhatsApp icon
import SmallMenu from './components/SmallMenu';
import Services from './components/Services';
// import { FloralModal } from './components/FloralModal';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'



export default function Page() {

  const whatsappNumber = '+233257441441'; // Replace with your WhatsApp number
  const whatsappMessage = 'Hello, I am interested in your event services.'; // Optional message

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  // const [floral, setFloral] = useState(false);


  const images = [
    '/location-images/gigloc.webp',
    '/location-images/gigloc1.webp',
    '/location-images/gigloc2.webp',
    '/location-images/gigloc3.webp',
    '/location-images/gigloc4.webp',
    '/location-images/gigloc5.webp',
  ]
  // State to manage full-screen image
  const [fullScreenImage, setFullScreenImage] = useState(null)

  // Function to toggle full-screen mode
  const toggleFullScreen = (imageSrc) => {
    if (fullScreenImage) {
      setFullScreenImage(null)
    } else {
      setFullScreenImage(imageSrc)
    }
  }

  return (
    <div className=' w-full '>



      <div className='w-full pt-32 fle md:h-[95vh] items-center justify-center'>
        <div>
          <Image
            src={'/smallgiglogo.avif'}
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
          <h1 className='text-primary text-2xl md:text-4xl font-semibold w-[80%] mx-auto text-center my-12 md:my-32'>The Complete Event Center</h1>
        </div>

      </div>
      {/* <div className='w-[90%] md:w-[70%]  mt- rounded-3xl mx-auto  h-[50%]'>
        <video
          autoPlay
          loop
          muted
          playsInline
          className='w-full opacity-50 rounded-3xl'
        >
          <source src="/videos/gigvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      </div> */}


      <div className='w-[90%] md:w-[40%] mt- mx-auto aspect-video'>
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className='w-full h-full rounded-3xl overflow-hidden'
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} onClick={() => toggleFullScreen(src)}>
              <div className='relative w-full h-full cursor-pointer'>
                <Image
                  src={src}
                  alt={`Event location image ${index}`}
                  layout='fill'
                  objectFit='cover'
                  className='opacity'
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>



      <div className=' w-[90%] mt-20  md:w-[70%] mx-auto'>
        <GetInTouch />
      </div>

      <div className='w-[80%] md:w-[25%] my-8 mx-auto'>
        <SmallMenu />
      </div>


      <div className='w-full'>
        <Services />
      </div>

      <div
        // onClick={() => setFloral(true)} 
        className="fixed bottom-36 md:bottom-40 right-8 md:right-24 bg-white rounded-full p-3 shadow-lg cursor-pointer z-50" >

        <Image src={'/rose.png'} width={40} height={40} />
      </div>
      <div className="fixed bottom-16 md:bottom-20 right-8 md:right-24 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg cursor-pointer z-50" onClick={handleWhatsAppClick}>

        <FaWhatsapp className="text-4xl" />
      </div>

      {/* Conditionally render the FloralModal */}
      {/* {floral && <FloralModal onClose={() => setFloral(false)} />} */}

      {/* Full-screen image overlay */}
      {fullScreenImage && (
        <div
          className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-50'
          onClick={() => toggleFullScreen(null)}
        >
          <Image
            src={fullScreenImage}
            alt='Full screen image'
            layout='intrinsic'
            width={1200}
            height={800}
            objectFit='contain'
            className='md:max-h-[90vh] w-full h-auto md:max-w-[90vw]'
          />
          <button
            className='absolute top-4 right-4 text-white text-2xl bg-gray-800 rounded-full p-2'
            onClick={() => toggleFullScreen(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
