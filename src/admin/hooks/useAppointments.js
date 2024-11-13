import { useState } from "react";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = async (page = 1, limit = 9, sortField = 'date', sortDirection = 'asc') => {
    try {
      setConfirming(true);
      const response = await fetch(
        `/api/appointments/get?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}`
      );
      const data = await response.json();
      setAppointments(data.appointments);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      throw new Error('Failed to fetch appointments');
    } finally {
      setConfirming(false);
    }
  };

  const createAppointments = async (newAppointment) => {
    try {
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setConfirming(false);
    }
  };

  return {
    appointments,
    pagination,
    confirming,
    setConfirming,
    error,
    createAppointments,
    fetchAppointments
  };
};