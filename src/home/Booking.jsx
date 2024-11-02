import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FaArrowLeft } from 'react-icons/fa';
import { useSettings } from '../admin/hooks/useSettings';
import 'react-datepicker/dist/react-datepicker.css';
import TimeSlotPicker from '../components/TimeSlotPicker';
import InfoHoverCard from '../components/InfoHoverCard'

const Booking = () => {
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
                <label htmlFor="email" className="block text-md font-semibold text-emerald-800 mb-2">
                  <div className="flex items-center gap-2">
                    Email
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
                <label htmlFor="vehicle" className="block text-md font-semibold text-emerald-800 mb-2">
                  Vehicle &nbsp;
                  <InfoHoverCard
                    content="Let us know what kind of car you're bringing in."
                  />
                </label>
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
                  {settings?.services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
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
                  filterDate={filterAvailableDates}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
              {formData.date &&
                <div>
                  <label htmlFor="time" className="block text-md font-semibold text-emerald-800 mb-2">Time</label>
                  {availableTimeSlots.map((slot) => (
                    <TimeSlotPicker time={slot.time} available={slot.available} onTimeSelect={handleTimeChange} selectedTime={formData.time} />
                  ))}
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                  {formData.date && availableTimeSlots.length === 0 && (
                    <p className="text-red-500 text-sm mt-1">No available time slots for this date</p>
                  )}
                </div>
              }
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