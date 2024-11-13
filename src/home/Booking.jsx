import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useSettings } from '../admin/hooks/useSettings';
import 'react-datepicker/dist/react-datepicker.css';
import TimeSlotPicker from '../components/TimeSlotPicker';
import InfoHoverCard from '../components/InfoHoverCard'

const Booking = ({ onBookingClick, bookingIsOpen }) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const { settings, loading, error, fetchSettings } = useSettings();
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
  const [selectedService, setSelectedService] = useState(null);

  const getDayName = (date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  // Create time slots based on settings
  const generateTimeSlots = (daySchedule, selectedDate) => {
    if (!daySchedule.isOpen) return [];

    const slots = [];
    const addTimeSlots = (startTime, endTime) => {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      let currentHour = startHour;
      let currentMinute = startMinute;

      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        // Check if there's enough time before the end for the service duration
        const slotTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const slotEndTime = new Date(selectedDate);
        slotEndTime.setHours(currentHour);
        slotEndTime.setMinutes(currentMinute + (selectedService?.duration || settings.appointmentDuration));

        const endTimeDate = new Date(selectedDate);
        const [endTimeHour, endTimeMinute] = endTime.split(':').map(Number);
        endTimeDate.setHours(endTimeHour);
        endTimeDate.setMinutes(endTimeMinute);

        if (slotEndTime <= endTimeDate) {
          slots.push({
            time: slotTime,
            available: true
          });
        }

        currentMinute += settings.appointmentDuration + settings.bufferTime;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }
      }
    };

    // Add slots for first period
    if (daySchedule.start && daySchedule.end) {
      addTimeSlots(daySchedule.start, daySchedule.end);
    }

    // Add slots for second period if it exists
    if (daySchedule.secondStart && daySchedule.secondEnd) {
      addTimeSlots(daySchedule.secondStart, daySchedule.secondEnd);
    }

    return slots;
  };

  useEffect(() => {
    if (formData.date && settings?.businessHours) {
      const dayName = getDayName(formData.date);
      const daySchedule = settings.businessHours[dayName];
      const slots = generateTimeSlots(daySchedule, formData.date);
      setAvailableTimeSlots(slots);
    }
  }, [formData.date, selectedService, settings]);

  useEffect(() => {
    if (formData.service && settings?.services) {
      const service = settings.services.find(s => s.id === formData.service);
      setSelectedService(service);
    }
  }, [formData.service, settings?.services]);

  const fetchAvailableTimeSlots = async (date) => {
    if (!date || !settings) return;

    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetchSettings(`availability-${formattedDate}`);

      if (response) {
        // Merge existing time slots with availability data
        const updatedSlots = availableTimeSlots.map(slot => ({
          ...slot,
          available: !response.bookedSlots?.includes(slot.time)
        }));
        setAvailableTimeSlots(updatedSlots);
      }
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
    }
  };

  // Filter out unavailable dates
  const filterAvailableDates = (date) => {
    if (!settings?.businessHours) return false;
    const dayName = getDayName(date);
    return settings.businessHours[dayName].isOpen;
  };


  const validateSection1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number, e.g. 9991112222';
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
    errors[name] && setErrors(prev => ({ ...prev, [name]: null }))
  };
  const handleTimeChange = (selectedTime) => {
    setFormData(prev => ({ ...prev, time: selectedTime }));
    errors.time && setErrors(prev => ({ ...prev, time: null }));
  }

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date, time: '' }));
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
          console.log('Appointment created:', result.appointmentId);
        } else {
          setErrors(prev => ({ ...prev, submit: result.error }));
        }
      } catch (error) {
        console.error('Failed to create appointment:', error);
        setErrors(prev => ({ ...prev, submit: 'Failed to create appointment' }));
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading booking form...</div>;
  }

  if (error) {
    console.log(error)
    return <div className="text-center py-8 text-red-500">Error loading booking settings. Please try again later.</div>;
  }

  return (
    <>
      {bookingIsOpen &&
        <div className="fixed inset-0 w-screen min:h-screen z-50 bg-white overflow-y-auto">
          <div className="min-h-screen py-8">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto px-4 relative">
              <button
                type="button"
                onClick={onBookingClick}
                className="absolute right-2 -top-5 p-2 hover:bg-teal-800 text-brand hover:text-white rounded-full transition-colors"
              >
                <FaTimes className="text-3xl " />
              </button>

              <h2 className="text-4xl font-bold text-teal-800 text-center pt-10">
                Book Your Appointment
              </h2>

              {/* Main Form Card */}
              <div className="bg-white">
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="flex flex-row relative overflow-hidden">
                    {/* Section 1 */}
                    <section
                      className="space-y-6 w-full transition-all duration-500 ease-in-out"
                      style={{
                        width: firstSection ? '100%' : '0%',
                        opacity: firstSection ? 1 : 0,
                        transform: firstSection ? 'translateX(0)' : 'translateX(-100%)',
                      }}
                    >
                      <div className="space-y-6">
                        {/* Name Input */}
                        <div>
                          <label htmlFor="name" className="block text-lg font-medium text-teal-800 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="on"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-800 focus:border-transparent transition-colors
                            ${errors.name ? 'border-red-300 bg-red-50' : 'border-teal-800 bg-white'}`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Phone Input */}
                        <div>
                          <label htmlFor="phone" className="block text-lg font-medium text-teal-800 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            autoComplete="on"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-800 focus:border-transparent transition-colors
                            ${errors.phone ? 'border-red-300 bg-red-50' : 'border-teal-800 bg-white'}`}
                            placeholder="Enter your phone number"
                          />
                          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Email Input */}
                        <div>
                          <label htmlFor="email" className="block text-lg font-medium text-teal-800 mb-2">
                            <div className="flex items-center gap-2">
                              Email Address
                              <InfoHoverCard
                                content="While email is optional, it's required for warranty coverage. Your email serves as your receipt and warranty verification document."
                                position="top"
                              />
                            </div>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="on"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-800 focus:border-transparent transition-colors
                            ${errors.email ? 'border-red-300 bg-red-50' : 'border-teal-800 bg-white'}`}
                            placeholder="Enter your email address"
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Next Button */}
                        <button
                          type="button"
                          onClick={handleForwardClick}
                          className="w-full bg-brand text-white py-3 px-6 rounded-lg font-semibold 
                          hover:bg-teal-700 active:bg-teal-800 transition-colors duration-200
                          shadow-lg hover:shadow-xl"
                        >
                          Continue to Details
                        </button>
                      </div>
                    </section>

                    {/* Section 2 */}
                    <section
                      className="space-y-6 w-full transition-all duration-500 ease-in-out"
                      style={{
                        width: firstSection ? '0%' : '100%',
                        opacity: firstSection ? 0 : 1,
                        transform: firstSection ? 'translateX(100%)' : 'translateX(0)',
                      }}
                    >
                      {/* Back Button */}
                      <button
                        type="button"
                        onClick={handleBackwardClick}
                        className="flex items-center gap-2 text-teal-800 hover:text-teal-700 font-medium mb-6 pt-1"
                      >
                        <FaArrowLeft className="text-lg" />
                        <span>Back to Contact Info</span>
                      </button>

                      {/* Vehicle Input */}
                      <div>
                        <label htmlFor="vehicle" className="block text-lg font-medium text-teal-800 mb-2 pr-5">
                          <div className="flex items-center gap-2">
                            Vehicle Details
                            <InfoHoverCard
                              className=""
                              content="Let us know what kind of car you're bringing in."
                            />
                          </div>
                        </label>
                        <input
                          type="text"
                          id="vehicle"
                          name="vehicle"
                          autoComplete="off"
                          value={formData.vehicle}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-800 focus:border-transparent transition-colors
                          ${errors.vehicle ? 'border-red-300 bg-red-50' : 'border-teal-800 bg-white'}`}
                          placeholder="e.g., 2019 Toyota Camry"
                        />
                        {errors.vehicle && <p className="text-red-500 text-sm mt-1">{errors.vehicle}</p>}
                      </div>

                      {/* Service Selection */}
                      <div>
                        <label htmlFor="service" className="block text-lg font-medium text-teal-800 mb-2">
                          Select Service
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-800 focus:border-transparent transition-colors
                          ${errors.service ? 'border-red-300 bg-red-50' : 'border-teal-800 bg-white'}`}
                        >
                          <option value="">Choose a service...</option>
                          {settings?.services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name} - ${service.price}
                            </option>
                          ))}
                        </select>
                        {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                      </div>

                      {/* Date Picker */}
                      <div>
                        <label htmlFor="date" className="block text-lg font-medium text-teal-800 mb-2">
                          Preferred Date
                        </label>
                        <DatePicker
                          selected={formData.date}
                          onChange={handleDateChange}
                          dateFormat="MMMM d, yyyy"
                          minDate={new Date()}
                          filterDate={filterAvailableDates}
                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-teal-800 focus:border-transparent transition-colors
                          ${errors.date ? 'border-red-300 bg-red-50' : 'border-teal-800 bg-white'}`}
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                      </div>

                      {/* Time Slots */}
                      {formData.date && (
                        <div>
                          <label className="block text-lg font-medium text-teal-800 mb-4">
                            Available Time Slots
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {availableTimeSlots.map((slot) => (
                              <TimeSlotPicker
                                key={slot.time}
                                time={slot.time}
                                available={slot.available}
                                onTimeSelect={handleTimeChange}
                                selectedTime={formData.time}
                              />
                            ))}
                          </div>
                          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                          {formData.date && availableTimeSlots.length === 0 && (
                            <p className="text-red-500 text-sm mt-1">No available time slots for this date</p>
                          )}
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-teal-700 text-white py-3 px-6 rounded-lg font-semibold 
                        hover:bg-teal-700 active:bg-teal-800 transition-colors duration-200
                        shadow-lg hover:shadow-xl mt-6"
                      >
                        Confirm Booking
                      </button>
                    </section>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Booking;