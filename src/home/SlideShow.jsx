import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Slideshow = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
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
    <section className="">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-emerald-700 mb-8 text-center">Our Work</h2>
        <div className="max-w-3xl mx-auto">
          <Slider {...settings}>
            <div className="px-2">
              <img src="/GCC-DirtyLights.webp" alt="Car cleaning example 1" className="w-full sm:h-96 object-cover rounded-lg" />
            </div>
            <div className="px-2">
              <img src="/GCC-CleanLights.webp" alt="Car cleaning example 2" className="w-full sm:h-96 object-cover rounded-lg" />
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Slideshow;