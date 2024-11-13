import React from 'react';
import { FaCar } from "react-icons/fa";
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
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      }
    ]
  };

  return (
    <section id='gallery' className="mt-64">
      <div className="max-w-4xl mx-auto">
        <div className='flex ml-7 justify-start' >
          <FaCar className='text-3xl text-teal-800 w-10 mr-2 mt-1' />
          <h2 className="text-3xl font-semibold text-teal-800 mb-8 text-center">Our Work</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <Slider {...settings}>
            {imageData.map((image) => {
              return (
                <div key={image.id} className="px-5 w-[70vw] h-[70vw]">
                  <img src={image.imageUrl} alt={image.text} className="w-full sm:h-96 object-cover object-center rounded-lg" />
                </div>
              )
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Slideshow;