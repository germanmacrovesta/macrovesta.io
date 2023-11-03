// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
// import Swiper and modules styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Image from 'next/image'

const Carrousel = ({ slides }) => {
  // Zoom function
  const handleClickZoom = (e) => {
    e.preventDefault()
  }

  return (
    <div className=''>
      <Swiper
      // install Swiper modules
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: true
        }}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
        className='rounded-2xl overflow-hidden h-[400px]'
        style={{
          '--swiper-pagination-color': '#4edd83',
          '--swiper-pagination-bullet-inactive-color': '#0f172a',
          '--swiper-pagination-bullet-inactive-opacity': '1',
          '--swiper-pagination-bullet-size': '16px',
          '--swiper-pagination-bullet-horizontal-gap': '6px'
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className='bg-slate-900 relative'>
            <Image src={slide} width={300} height={400} className='mx-auto ' onClick={handleClickZoom} alt={`Product slide ${index}`} />
          </SwiperSlide>
        ))}
        ...
      </Swiper>

    </div>
  )
}

export default Carrousel
