import React from 'react';

const Hero = ({ onBookingClick }) => {
  return (
    <section id="home" className="pb-20 p-5 bg-brand">
      <div className="max-w-6xl mx-auto mt-10">
        <h3 className="text-4xl font-medium font-serif text-white mb-6 text-center leading-normal">With Every Detail Customer Satisfaction is Our Aim</h3>
        <div className="grid gap-8">
          <div className='px-5 pt-5'>
            <p className="text-lg text-slate-200 text-center font-bold mb-4 leading-loose">
              Gabriel Car Cleaning provides top-notch auto detailing services in the Modesto area.
              With our expertise and state-of-the-art equipment, we ensure your vehicle
              looks its best.
            </p>
          </div>
          <div className='flex justify-center pb-5'>
            <button onClick={() => onBookingClick()} className='bg-teal-700 hover:bg-teal-900 py-4 px-8 rounded-lg text-white text-xl font-semibold tracking-wider'>Reserve</button>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Our Commitment to You</h2>
            <p className="text-slate-200 text-lg leading-relaxed font-bold mb-4">
              We are committed to delivering exceptional car cleaning services that exceed
              our customers' expectations. Our goal is to restore and maintain the beauty
              of your vehicle while providing a hassle-free experience.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Experience</h2>
          <p className="text-slate-200 text-lg leading-relaxed font-bold">
            With over 10 years of experience in the auto detailing industry, we have
            perfected our techniques and use only the best products to ensure your
            satisfaction. Trust Gabriel Car Cleaning for all your vehicle cleaning needs.
          </p>
        </div>
      </div>
      <br id="gallery" />
      <div className="relative -mb-16 w-full">
        {/* Center container */}
        <div className="absolute left-1/2 top-16 -translate-x-1/2 -translate-y-10 flex items-center justify-center">
          {/* Image container - centered over triangle */}
          <div className="relative z-10">
            <div className="w-[70vw] h-[50vw] shadow-lg">
              <img
                src="/GCCHeadlightRemoved.JPG"
                alt="Gabriel showcase image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Spacer to maintain height */}
        <div className="h-32" />
      </div>
    </section>
  );
};

export default Hero;