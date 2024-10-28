import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaArrowLeft } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';

const Booking = () => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    service: '',
    date: '',
    time: ''
  });
  const [errors, setErrors] = useState({});
  const [firstSection, setFirstSection] = useState(true);

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return { time: `${hour.toString().padStart(2, '0')}:${minute}`, available: true };
  });

  const fetchAvailableTimeSlots = async (date) => {
    if (!date) return;
    console.log(date)
    try {
      //Uncomment when time data is live 
      // const formattedDate = date.toISOString().split('T')[0];
      // const response = await fetch(`/api/availability/get?date=${formattedDate}`);
      // const slots = await response.json();
      setAvailableTimeSlots(timeSlots);
    } catch (error) {
      console.error('Failed to fetch time slots:', error)
    }
  };

  const validateSection1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSection2 = () => {
    const newErrors = {};
    if (!formData.vehicle.trim()) newErrors.vehicle = 'Vehicle information is required';
    if (!formData.service) newErrors.service = 'Please select a service';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.time) newErrors.time = 'Please select a time';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
    fetchAvailableTimeSlots(date);
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: null }));
    }
  };

  const handleForwardClick = () => {
    if (validateSection1()) {
      setFirstSection(false);
    }
  };

  const handleBackwardClick = () => {
    setFirstSection(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateSection2()) {
      try {
        const response = await fetch('/api/appointments/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          // Handle success (e.g., show success message, redirect)

          console.log('Appointment created:', result.appointmentId);
        } else {
          // Handle error
          setErrors(prev => ({ ...prev, submit: result.error }));
        }
      } catch (error) {
        console.error('Failed to create appointment:', error);
        setErrors(prev => ({ ...prev, submit: 'Failed to create appointment' }));
      }
    }
  };

  return (
    <section id="book-now" className="mt-20 pb-24 sm:pb-0">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-emerald-700 text-center">Book Your Appointment</h2>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-row">
            <section
              id="Section1"
              className="space-y-6"
              style={{
                width: firstSection ? '100%' : '0%',
                paddingLeft: firstSection ? '10px' : '0',
                opacity: firstSection ? 1 : 0,
                transform: firstSection ? 'translateX(-20px)' : 'translateX(0)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
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
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-md font-semibold text-emerald-800 mb-2">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="on"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-md font-semibold text-emerald-800 mb-2">Email <span className="text-sm text-gray-400">* Optional</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="on"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleForwardClick}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Next
                </button>
              </div>
            </section>
            <section
              id="Section2"
              className="space-y-6"
              style={{
                width: firstSection ? '0%' : '100%',
                position: 'relative',
                left: firstSection ? '0' : '-30px',
                opacity: firstSection ? 0 : 1,
                transform: firstSection ? 'translateX(0px)' : 'translateX(20px)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div>
                <button
                  type="button"
                  onClick={handleBackwardClick}
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
                  value={formData.vehicle}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.vehicle ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.vehicle && <p className="text-red-500 text-sm mt-1">{errors.vehicle}</p>}
              </div>
              <div>
                <label htmlFor="service" className="block text-md font-semibold text-emerald-800 mb-2">Service</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a service</option>
                  <option value="single">Single Headlight - $30</option>
                  <option value="double">Full Headlight - $60</option>
                </select>
                {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
              </div>
              <div>
                <label htmlFor="date" className="block text-md font-semibold text-emerald-800 mb-2">Date</label>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
              <div>
                <label htmlFor="time" className="block text-md font-semibold text-emerald-800 mb-2">Time</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a time</option>
                  {availableTimeSlots.map((slot) => (
                    <option
                      key={slot.time}
                      value={slot.time}
                      disabled={!slot.available}
                    >
                      {slot.time} {!slot.available ? '(Unavailable)' : ''}
                    </option>
                  ))}
                </select>
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
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