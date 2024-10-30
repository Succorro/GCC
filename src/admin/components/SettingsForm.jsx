import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';

export const SettingsForm = () => {
  const { settings, updateSettings, loading, error } = useSettings();
  const [formData, setFormData] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (!formData) {
    return <div>No settings found</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      setStatus('Settings updated successfully');
    } catch (err) {
      setStatus('Failed to update settings');
    }
  };

  const handleDayChange = (day, field, value) => {
    setFormData({
      ...formData,
      businessHours: {
        ...formData.businessHours,
        [day]: {
          ...formData.businessHours[day],
          [field]: value
        }
      }
    });
  };

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
                  <>
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
                  </>
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
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            {formData.services.map((service, index) => (
              <div key={service.id} className="grid grid-cols-6 gap-4 mb-4">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => {
                      const newServices = [...formData.services];
                      newServices[index].name = e.target.value;
                      setFormData({ ...formData, services: newServices });
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => {
                      const newServices = [...formData.services];
                      newServices[index].price = parseInt(e.target.value);
                      setFormData({ ...formData, services: newServices });
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={service.duration}
                    onChange={(e) => {
                      const newServices = [...formData.services];
                      newServices[index].duration = parseInt(e.target.value);
                      setFormData({ ...formData, services: newServices });
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
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