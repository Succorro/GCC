import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const configureSettings = async () => {
    try {
      const response = await fetch('/api/admin/configure');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      setSettings(data.settings);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchSettings = async () => {
    try {
      // const response = await fetch('/api/settings/get');
      
      // if (!response.ok) {
      //   if (response.status === 404) {
      //     // If settings don't exist, trigger initial configuration
      //     return await configureSettings();
      //   }
      //   throw new Error('Failed to fetch settings');
      // }
      
      // const data = await response.json();
      const data = {
        businessHours: {
          monday: { 
            isOpen: false 
          },
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
          thursday: { 
            isOpen: false 
          },
          friday: { 
            isOpen: false 
          },
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
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const updateSettings = async (newSettings) => {
    try {
      const response = await fetch('/api/settings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      
      const data = await response.json();
      setSettings(data.settings);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, error, updateSettings, configureSettings, fetchSettings };
};