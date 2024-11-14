import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { SettingsForm } from './SettingsForm';
import AppointmentsList from './AppointmentsList';
import CreateAppointment from './CreateAppointments';


export const AdminLayout = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await logout()
      navigate("/admin/login")
    } catch (error) {
      setErrorMessage('Logout Unsuccessful', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mt-5 h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex flex-col items-start mt-1">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <h1 className="text-xl ">Welcome {user?.username}</h1>
              </div>
            </div>
            <div>
              <button
                onClick={handleClick}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className='bg-red-500/30 m-10 text-white'>
        {errorMessage}
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AppointmentsList />
        <CreateAppointment />
        <SettingsForm />
      </main>
    </div>
  );
};