import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { IoClose as X } from "react-icons/io5";
import { FaPlus as Plus } from "react-icons/fa";

export const SettingsForm = () => {
  const { settings, updateSettings, loading, error } = useSettings();
  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    } else {
      const defaultSettings = {
        businessHours: {
          monday: { isOpen: false },
          tuesday: {
            start: '08:00',
            end: '12:00',
            breakStart: '12:00',
            breakEnd: '15:00',
            secondStart: '15:00',
            secondEnd: '18:00',
            isOpen: true
          },
          wednesday: {
            start: '08:00',
            end: '12:00',
            breakStart: '12:00',
            breakEnd: '15:00',
            secondStart: '15:00',
            secondEnd: '18:00',
            isOpen: true
          },
          thursday: { isOpen: false },
          friday: { isOpen: false },
          saturday: {
            start: '10:00',
            end: '16:00',
            isOpen: true
          },
          sunday: {
            start: '10:00',
            end: '16:00',
            isOpen: true
          }
        },
        appointmentDuration: 30,
        bufferTime: 0,
        services: [
          { id: 'single', name: 'Single Headlight', duration: 30, price: 30 },
          { id: 'double', name: 'Full Headlight', duration: 60, price: 60 }
        ],
        notifications: {
          confirmationTemplateId: 2,
          senderEmail: "quote@gabrielcarcleaning.com",
          senderName: "Gabriel Car Cleaning"
        }
      };
      setFormData(defaultSettings);
    }
  }, [settings]);

  const handleAddNew = () => {
    const newService = {
      id: `service-${Date.now()}`, // Generate unique ID
      name: '',
      duration: 30,
      price: 0
    };

    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const handleRemoveService = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleServiceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => {
        if (i === index) {
          return {
            ...service,
            [field]: field === 'name' ? value : parseInt(value) || 0
          };
        }
        return service;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      // Validate services
      const invalidServices = formData.services.filter(
        service => !service.name || service.duration <= 0 || service.price < 0
      );

      if (invalidServices.length > 0) {
        setStatus('Please fill in all service details correctly');
        return;
      }

      await updateSettings(formData);
      setStatus('Settings updated successfully');
    } catch (err) {
      setStatus('Failed to update settings: ' + err.message);
    }
  };

  const handleDayChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (!formData) {
    return <div>No settings found</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Business Hours
            </h3>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            {Object.entries(formData.businessHours).map(([day, hours]) => (
              <div key={day} className="grid grid-cols-6 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {day}
                  </label>
                </div>
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={hours.isOpen}
                    onChange={(e) => handleDayChange(day, 'isOpen', e.target.checked)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Open</span>
                </div>
                {hours.isOpen && (
                  <div className="col-span-3">
                    <div className="flex space-x-4">
                      <input
                        type="time"
                        value={hours.start}
                        onChange={(e) => handleDayChange(day, 'start', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <input
                        type="time"
                        value={hours.end}
                        onChange={(e) => handleDayChange(day, 'end', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Services
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add and manage your services
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-12 gap-4 mb-4 font-medium text-sm text-gray-700">
              <div className="col-span-4">Name</div>
              <div className="col-span-3">Price ($)</div>
              <div className="col-span-3">Duration (min)</div>
              <div className="col-span-2"></div>
            </div>
            {formData.services.map((service, index) => (
              <div key={service.id} className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-4">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                    placeholder="Service name"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                    min="0"
                    placeholder="Price"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={service.duration}
                    onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                    min="1"
                    placeholder="Duration"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2 flex items-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
            <div className='flex justify-end'>
              <button
                type="button"
                onClick={handleAddNew}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus size={20} className="mr-2" />
                Add Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {status && (
        <div className={`rounded-md p-4 ${status.includes('success') ? 'bg-green-50' : 'bg-red-50'
          }`}>
          <div className={`text-sm ${status.includes('success') ? 'text-green-700' : 'text-red-700'
            }`}>
            {status}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;