import React from 'react'

const Navigation = () => {
  return (
    <div className='bg-blue-200 w-full h-16 '>
      <div className='flex justify-between items-center p-4'>
        <div className='w-8 '>
          <img src="/menu.svg" alt="menuIcon" />
        </div>
        <div>
          <h2>Gabriel Car Cleaning</h2>
        </div>
      </div>
    </div>
  )
}

export default Navigation