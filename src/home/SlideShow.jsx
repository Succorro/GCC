import React from 'react';
import { FaCar } from "react-icons/fa";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Slideshow = () => {
  const imageData = [
    // {
    //   id: 1,
    //   imageUrl: '/GCC-DirtyLights.webp',
    //   text: 'Dirty Lights'
    // },
    // {
    //   id: 2,
    //   imageUrl: '/GCC-CleanLights.webp',
    //   text: 'Clean Lights'
    // },
    {
      id: 3,
      imageUrl: '/GCCHeadlightGrayBefore.JPG',
      text: 'Dirty Lights'
    },
    {
      id: 4,
      imageUrl: '/GCCHeadlightGrayAfter.JPG',
      text: 'Dirty Lights'
    },
    {
      id: 5,
      imageUrl: '/GCCHeadlightRedBefore.JPG',
      text: 'Dirty Lights'
    },
    {
      id: 6,
      imageUrl: '/GCCHeadlightRedAfter.JPG',
      text: 'Combo Lights'
    },
  ]

  const CustomArrow = ({ direction, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`absolute z-10 top-1/2 -translate-y-1/2 
          ${direction === 'prev' ? 'left-2' : 'right-2'}
          text-white hover:text-white/80 transition-colors
          text-4xl cursor-pointer`}
        aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
      >
        {direction === 'prev' ?
          <IoIosArrowDropleftCircle /> :
          <IoIosArrowDroprightCircle />
        }
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
    dotsClass: "slick-dots bottom-4",
  };
  return (
    <section id='gallery' className="mt-64">
      <div className="flex flex-col md:items-center mx-auto">
        <div className='flex ml-8 items-start w-full md:ml-24' >
          <FaCar className='text-3xl text-teal-800 w-10 mr-2 mt-1' />
          <h2 className="text-3xl font-semibold text-teal-800 mb-8 text-center">Our Work</h2>
        </div>
        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="aspect-[4/3] md:aspect-[16/9]">
            <Slider {...settings} className="h-full md:mx-10">
              {imageData.map((image) => (
                <div key={image.id} className="outline-none px-1">
                  <div className="aspect-[4/3] md:aspect-[16/9]">
                    <img
                      src={image.imageUrl}
                      alt={image.text}
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Slideshow;