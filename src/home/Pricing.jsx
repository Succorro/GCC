import React from 'react';

const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-emerald-800 mb-8 text-center">Our Pricing</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Premium Headlight Restoration</h3>
            <p className="text-4xl font-bold text-emerald-800 mb-6">$60</p>
            <ul className="text-gray-700 mb-6">
              <li className="mb-2">✓ Full Headlight Restoration</li>
              <li className="mb-2">✓ Ceramic Coating</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Single Headlight</h3>
            <p className="text-4xl font-bold text-emerald-800 mb-6">$30</p>
            <ul className="text-gray-700 mb-6">
              <li className="mb-2">✓ Headlight Restoration</li>
              <li className="mb-2">✓ Ceramic Coating</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Additional Services</h3>
          <p className="text-gray-700">
            We offer a range of additional services including Exterior Detailing, Interior Detailing,
            Paint Correction and more! Please contact us for custom pricing on these services.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;