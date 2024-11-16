import React from 'react'
import AppointmentsList from '../components/AppointmentsList'
import CreateAppointment from '../components/CreateAppointments'

const Appointments = () => {
  return (
    <div>
      <AppointmentsList />
      <CreateAppointment />
    </div>
  )
}

export default Appointments