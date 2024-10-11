import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-emerald-800 mb-6">Gabriel Car Cleaning</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">About Us</h2>
            <p className="text-gray-700 mb-4">
              Gabriel Car Cleaning provides top-notch auto detailing services in your area.
              With our expert team and state-of-the-art equipment, we ensure your vehicle
              looks its best inside and out.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              We are committed to delivering exceptional car cleaning services that exceed
              our customers' expectations. Our goal is to restore and maintain the beauty
              of your vehicle while providing a hassle-free experience.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Our Experience</h2>
          <p className="text-gray-700">
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