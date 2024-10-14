import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaArrowLeft } from 'react-icons/fa';

import 'react-datepicker/dist/react-datepicker.css';

const Booking = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState(null);

  const [firstSection, setFirstSection] = useState(true)

  const handleClick = () => {
    console.log(name)
    setFirstSection(!firstSection)
  }
  return (
    <section id="book-now" className="py-10 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-emerald-800 mb-8 text-center">Book Your Appointment</h2>
        <div className="p-6">
          <form className=" flex flex-row">
            <section
              id="Section1"
              className='space-y-6'
              style={{
                width: firstSection ? '100%' : '0%',
                opacity: firstSection ? 1 : 0,
                transform: firstSection ? 'translateX(-20px)' : 'translateX(0)',
                transition: ['width 0.5s cubic-bezier(0.4, 0, 0.2, 1)', 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)', 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)']
              }}
            >
              <div>
                <label htmlFor="name" className="block text-md font-semibold text-emerald-800 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="on"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-md font-semibold text-emerald-800 mb-2">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  autoComplete="on"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-md font-semibold text-emerald-800 mb-2">Email <span className='text-sm text-gray-400'>* Optional</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="on"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <button
                  type='button'
                  onClick={() => handleClick()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Next
                </button>
              </div>
            </section>
            <section
              id='Section2'
              className='space-y-6'
              style={{
                width: firstSection ? '0%' : '100%',
                opacity: firstSection ? 0 : 1,
                transform: firstSection ? 'translateX(0px)' : 'translateX(20)',
                transition: ['width 0.5s cubic-bezier(0.4, 0, 0.2, 1)', 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)', 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)']
              }}
            >
              <div>
                <button
                  type='button'
                  onClick={() => handleClick()}
                  className="text-black"
                >
                  <FaArrowLeft />
                </button>
              </div>
              <div>
                <label htmlFor="vehicle" className="block text-md font-semibold text-emerald-800 mb-2">Vehicle</label>
                <input
                  type="text"
                  id="vehicle"
                  name="vehicle"
                  autoComplete="off"
                  value={vehicle}
                  onChange={(event) => setVehicle(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label htmlFor="service" className="block text-md font-semibold text-emerald-800 mb-2">Service</label>
                <select id="service" name="service" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select a service</option>
                  <option value="single">Single Headlight - $30</option>
                  <option value="double">Full Headlight - $60</option>
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-md font-semibold text-emerald-800 mb-2">Date</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition duration-300">
                  Book Appointment
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;