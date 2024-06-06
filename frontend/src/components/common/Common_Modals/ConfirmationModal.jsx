import React from 'react'

const ConfirmationModal = ({confirmationModal}) => {
  return (
    <div className='w-screen h-screen absolute top-0 left-0 z-[999] bg-grey-5 bg-opacity-15 backdrop-blur-sm flex justify-center items-center overflow-hidden'>
        <div className='w-[95%] sm:w-[80%] md:w-[69%] lg:w-[40%] h-[30%] bg-white  dark:bg-black-50  rounded-[10px] p-4 dark:border-none border-2 border-grey-5 shadow-md flex flex-col justify-between '>
            <div>
                <p className='text-[24px] font-bold text-black-50 dark:text-grey-75 '>{confirmationModal?.title}</p>
                <p className='text-[14px] font-semibold text-black-50 dark:text-grey-75 '>{confirmationModal?.description}</p>
            </div>
            
            <div className='w-full flex items-center justify-end gap-x-2'>
                <button onClick={confirmationModal?.btn1Handler} className='w-fit px-3 py-1 rounded-[5px] bg-grey-25 dark:bg-black-25 dark:text-grey-75  text-[13px] flex justify-center items-center font-semibold'>{confirmationModal?.btn1Text}</button>
                <button  onClick={confirmationModal?.btn2Handler} className='w-fit px-3 py-1 rounded-[5px] bg-[#fc4848]  text-[13px] flex justify-center items-center text-white font-semibold' >{confirmationModal?.btn2Text}</button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmationModal