import React from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import ToolBar from './ToolBar';
import { useDispatch, useSelector } from 'react-redux';
import { setShowToolDesignBar } from '../../../slices/toolSlice';

const TopNavbar = () => {
  const dispatch = useDispatch();
  const {showToolDesignBar} = useSelector((state) => state.tool);
  return (
    <div className='w-[100%] h-[36px] absolute top-4 left-0 bg-white flex items-center justify-between px-7 '>
         
         <div className='w-full h-[36px] '>
                    <div className='h-[36px] w-[36px] flex justify-center items-center rounded-[10px] bg-grey-25 cursor-pointer shadow-sm'>
                         <RxHamburgerMenu onClick={() => dispatch(setShowToolDesignBar(!showToolDesignBar))}/>
                    </div>   
         </div>

         <div className='w-full h-[36px] '>
              <ToolBar/>  
         </div>

         <div className='w-full h-[36px] flex items-center justify-end '>
                 <button className='px-4 h-[36px] rounded-[10px] bg-blue-25 text-white font-extralight '>
                  Share
                 </button>
         </div>
    </div>
  )
}

export default TopNavbar