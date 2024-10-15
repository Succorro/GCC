import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="pb-20 pt-5">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-4xl font-bold font-Veranda text-emerald-800 mb-6 text-center leading-normal">With Every Detail Customer Satisfaction is Our Aim</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-700 font-bold mb-4 ">
              Gabriel Car Cleaning provides top-notch auto detailing services in the Modesto area.
              With our expertise and state-of-the-art equipment, we ensure your vehicle
              looks its best.
            </p>
          </div>
          <div className='flex justify-center'>
            <a href="/#book-now">
              <button className='bg-emerald-700 hover:bg-emerald-800 py-3 px-6 rounded-3xl text-white font-bold'>Book Now</button>
            </a>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Our Mission</h2>
            <p className="text-gray-700 font-bold mb-4">
              We are committed to delivering exceptional car cleaning services that exceed
              our customers' expectations. Our goal is to restore and maintain the beauty
              of your vehicle while providing a hassle-free experience.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Our Experience</h2>
          <p className="text-gray-700 font-bold">
            With over 10 years of experience in the auto detailing industry, we have
            perfected our techniques and use only the best products to ensure your
            satisfaction. Trust Gabriel Car Cleaning for all your vehicle cleaning needs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;