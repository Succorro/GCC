import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Slideshow = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
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
    <section id="gallery" className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-emerald-800 mb-8 text-center">Our Work</h2>
        <div className="max-w-3xl mx-auto">
          <Slider {...settings}>
            <div className="px-2">
              <img src="/GCC-DirtyLights.webp" alt="Car cleaning example 1" className="w-full sm:h-96 object-cover rounded-lg" />
            </div>
            <div className="px-2">
              <img src="/GCC-CleanLights.webp" alt="Car cleaning example 2" className="w-full sm:h-96 object-cover rounded-lg" />
            </div>
            <div className="px-2">
              <img src="/GCC-" alt="Car cleaning example 3" className="w-full sm:h-96 object-cover rounded-lg" />
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Slideshow;