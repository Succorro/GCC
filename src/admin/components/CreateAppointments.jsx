import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useAppointments } from '../hooks/useAppointments';
import { useSettings } from '../hooks/useSettings';
import { useEffect } from 'react';

const CreateAppointment = ({ onSuccess }) => {
  const { createAppointments } = useAppointments();
  const { fetchSettings } = useSettings();
  const [error, setError] = useState(null);
  const [services, setServices] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [displayCreateForm, setDisplayCreateForm] = useState(false);

  useEffect(() => {
    const getServices = async () => {
      setIsLoadingServices(true);
      try {
        const response = await fetchSettings();
        if (response?.services) {
          setServices(response.services);
          // Set the first service as default if available
          if (response.services.length > 0) {
            setFormData(prev => ({
              ...prev,
              service: response.services[0]
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setError('Failed to load services. Please try again later.');
      } finally {
        setIsLoadingServices(false);
      }
    };
    getServices();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    service: '',
    date: '',
    time: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'service') {
      setFormData(prev => ({
        ...prev,
        service: services.find(s => s.id === parseInt(value))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createAppointments(formData);
      onSuccess?.();
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        vehicle: '',
        service: services[0],
        date: '',
        time: '',
        address: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!displayCreateForm) return <button onClick={() => { setDisplayCreateForm(prev => !prev) }} className='flex mx-auto bg-brand text-white py-4 px-8 '>Create New Appointment</button>
  if (isLoadingServices) return <FaSpinner className="animate-spin text-brand" />

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900">Create New Appointment</h2>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle
          </label>
          <input
            type="text"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <select
            name="service"
            value={formData.service.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price} ({service.duration}min)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-teal-400 flex items-center gap-2"
        >
          {isSubmitting && <FaSpinner className="animate-spin text-brand" />}
          {isSubmitting ? 'Creating...' : 'Create Appointment'}
        </button>
      </div>
    </form>
  );
};

export default CreateAppointment;