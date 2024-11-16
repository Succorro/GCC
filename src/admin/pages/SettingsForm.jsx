import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { IoClose as X } from "react-icons/io5";
import { FaPlus as Plus } from "react-icons/fa";

export const SettingsForm = () => {
  const { settings, updateSettings, loading, error } = useSettings();
  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('business-hours');

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
      id: `service-${Date.now()}`,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-brand p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return <div>No settings found</div>;
  }

  console.log()
  return (
    <div className="min-h-screen bg-brand p-8">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Settings</h1>
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
            >
              Save changes
            </button>
          </div>

          <nav className="flex space-x-4 border-b border-slate-200">
            {['business-hours', 'services'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm font-medium ${activeTab === tab
                  ? 'text-white border-b-2 border-white'
                  : 'text-slate-300 hover:text-slate-400'
                  }`}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </nav>

          {activeTab === 'business-hours' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Business Hours</h2>
                <div className="space-y-4">
                  {Object.entries(formData.businessHours).map(([day, hours], index) => {
                    console.log(formData.businessHours)
                    //Steven Fix the input value, should be mutable, possible issue with data integration?? 
                    return (
                      <div key={day}>
                        <div className="grid grid-cols-12 gap-4 items-start py-4">
                          <div className="col-span-3">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={hours.isOpen}
                                onChange={(e) => handleDayChange(day, 'isOpen', e.target.checked)}
                                className="h-4 w-4 text-brand border-slate-300 rounded focus:ring-brand"
                              />
                              <span className="text-sm font-medium text-slate-900 capitalize">
                                {day}
                              </span>
                            </div>
                          </div>
                          {hours.isOpen && (
                            <div className="col-span-9">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <label className="block text-xs text-slate-500 mb-1">Opening Time</label>
                                  <input
                                    type="time"
                                    value={hours.start || ''}
                                    onChange={(e) => handleDayChange(day, 'start', e.target.value)}
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-slate-500 mb-1">Closing Time</label>
                                  <input
                                    type="time"
                                    value={hours.end || ''}
                                    onChange={(e) => handleDayChange(day, 'end', e.target.value)}
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                                  />
                                </div>
                                {(hours.breakStart && hours.breakEnd) && (
                                  <>
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Break Start</label>
                                      <input
                                        type="time"
                                        value={hours.breakStart || ''}
                                        onChange={(e) => handleDayChange(day, 'breakStart', e.target.value)}
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-slate-500 mb-1">Break End</label>
                                      <input
                                        type="time"
                                        value={hours.breakEnd || ''}
                                        onChange={(e) => handleDayChange(day, 'breakEnd', e.target.value)}
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {index < Object.entries(formData.businessHours).length - 1 && (
                          <div className="border-b border-slate-200" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-slate-900">Services</h2>
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Service
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.services.map((service, index) => (
                    <div key={service.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white rounded-lg text-black">
                      <div className="col-span-4">
                        <label className="block text-xs text-slate-500 mb-1">Service Name</label>
                        <input
                          type="text"
                          value={formData.services[index].name}
                          onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                          className="block w-full  rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                          placeholder="Enter service name"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs text-slate-500 mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={formData.services[index].price}
                          onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                          min="0"
                          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-xs text-slate-500 mb-1">Duration (min)</label>
                        <input
                          type="number"
                          value={formData.services[index].duration}
                          onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                          min="1"
                          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"
                          placeholder="30"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveService(index)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {status && (
            <div className={`rounded-md p-4 ${status.includes('success') ? 'bg-green-50' : 'bg-red-50'
              }`}>
              <p className={`text-sm ${status.includes('success') ? 'text-green-700' : 'text-red-700'
                }`}>
                {status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;