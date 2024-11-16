import React, { useState, useRef, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SettingsForm } from '../pages/SettingsForm';
import { FiSidebar, FiCalendar, FiSettings, FiX } from 'react-icons/fi';
import Appointments from '../pages/Appointments';

export const AdminLayout = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState('appointments');
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const navItems = [
    { id: 'appointments', name: 'Appointments', icon: FiCalendar },
    { id: 'settings', name: 'Business Settings', icon: FiSettings },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      setErrorMessage('Logout Unsuccessful');
    }
  };

  const handleNavClick = (componentId) => {
    setActiveComponent(componentId);
    setIsSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/admin/login" state={{ from: location }} replace />;
  // }

  return (
    <div className="min-h-screen bg-brand text-white">
      {/* Header */}
      <nav className="shadow-sm pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center pt-5 h-16">
            <div className="md:hidden">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <FiSidebar size={24} className="hover:text-slate-200" />
              </button>
            </div>
            <div className="flex justify-between md:w-full items-center">
              <div className="flex mr-10">
                <div className="flex-shrink-0 flex flex-col items-start mt-1 mb-2">
                  <h1 className="text-xl font-bold text-slate-50">Admin Dashboard</h1>
                  <h1 className="text-xl">Welcome {user?.username}</h1>
                </div>
              </div>
              <button
                onClick={handleClick}
                className="group relative flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-500/30 m-10 text-white p-4 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Main Content */}
      <main className="flex max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative">
        {/* Mobile Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed md:hidden left-0 top-0 h-full border border-l-0 border-y-0 border-white/5 bg-brand backdrop-blur-sm w-64 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white hover:text-slate-300 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="flex flex-col space-y-2 p-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeComponent === item.id
                  ? 'bg-teal-800/80 text-white'
                  : 'hover:bg-white/10'
                  }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-col space-y-2 mr-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeComponent === item.id
                ? 'bg-teal-800/80 text-white'
                : 'hover:bg-white/10'
                }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Component Render Area */}
        <div className="flex-1">
          {activeComponent === 'appointments' && <Appointments />}
          {activeComponent === 'settings' && <SettingsForm />}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;