import React, { useEffect, useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ITEMS_PER_PAGE = 9;

const AppointmentsList = () => {
  const {
    appointments,
    confirming,
    error,
    fetchAppointments
  } = useAppointments();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Pagination calculations
  const totalPages = appointments ? Math.ceil(appointments.length / ITEMS_PER_PAGE) : 0;
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  // Sort and paginate appointments
  const sortedAndPaginatedAppointments = appointments
    ? appointments
      .sort((a, b) => {
        if (sortField === 'date') {
          return sortDirection === 'asc'
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        }
        return 0;
      })
      .slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (!appointments) return <div>Appointments Not Available</div>
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center mb-6">
        <h1 className='text-3xl font-bold font-serif text-brand m-4'>
          Appointments
        </h1>
        <div className="flex justify-center gap-4">
          <select
            className="px-3 py-2 border rounded-lg"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>
          <button
            className="px-3 py-2 border rounded-lg"
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection.toUpperCase()}
          </button>
          <button
            onClick={() => fetchAppointments()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {!appointments || appointments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No appointments found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {sortedAndPaginatedAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${appointment.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaClock className="w-5 h-5 text-gray-600" />
                    <span>{appointment.time} ({appointment.duration})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaUser className="w-5 h-5 text-gray-600" />
                    <span>{appointment.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaEnvelope className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">{appointment.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPhone className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">{appointment.phone}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <FaCar className="w-5 h-5 text-gray-600" />
                      <span>{appointment.vehicle}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaTools className="w-5 h-5 text-gray-600" />
                      <span>{appointment.service}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaDollarSign className="w-5 h-5 text-gray-600" />
                      <span>${appointment.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600">{appointment.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg ${currentPage === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentsList;