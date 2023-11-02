"use client"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";

const HeroCarousel = () => {
    const heroImages =[
        {imgUrl:'/assets/images/hero-1.svg', alt:'smartwatch'},
        {imgUrl:'/assets/images/hero-2.svg', alt:'bag'},
        {imgUrl:'/assets/images/hero-3.svg', alt:'lamp'},
        {imgUrl:'/assets/images/hero-4.svg', alt:'air fryer'},
        {imgUrl:'/assets/images/hero-5.svg', alt:'chair'}
    ]
  return (
    <div className="hero-carousel">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={2000}
        showArrows={false}
        showStatus={false}
      >
            {heroImages.map((product) => (
                <Image
                    src={product.imgUrl}
                    alt={product.alt}
                    height={484}
                    width={484}
                    className="object-contain"
                    key={product.alt}
                />
            ))}
     </Carousel>
     <Image
        src="assets/icons/hand-drawn-arrow.svg"
        alt="arrow"
        width={175}
        height={175}
        className="max-xl:hidden absolute -left-[15%] bottom-5 z-0"
        />  
    </div>
  )
}

export default HeroCarousel
