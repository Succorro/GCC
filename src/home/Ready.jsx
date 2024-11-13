import React from 'react'

const Ready = () => {
  return (
    <div className='flex flex-col justify-center bg-teal-800 pt-20 tracking-wider'>
      <div className='flex flex-col text-center mb-10'>
        <h3 className='text-3xl font-serif text-white mb-2'>Ready?</h3>
        <p className='text-xl text-slate-100'>We'll take care of your car</p>
      </div>
      <div className='flex justify-center'>
        <button className='bg-brand hover:bg-teal-900 py-4 px-8 rounded-lg text-white text-xl font-semibold'>Reserve</button>
      </div>
      <div >
        <img src="/wave.svg" alt="waves" />
      </div>
    </div>
  )
}

export default Ready