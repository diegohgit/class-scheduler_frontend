import React from 'react'

export default function LoadingMessage({text}) {
  return (
    <div className='w-fit h-fit flex
                  bg-gray-700 z-20 rounded-xl 
                    fixed mx-auto mb-5
                    bottom-0 left-0 right-0 
                    justify-center items-center p-2'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="mr-2 size-6 animate-pulse">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>

      <p className='text-white'>{text}</p>
    </div>
  )
}
