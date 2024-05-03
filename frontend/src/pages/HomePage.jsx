import React from 'react'
import TopNavbar from '../components/common/TopNavbar/TopNavbar'
import { useSelector } from 'react-redux';
import ToolDesignBar from '../components/common/ToolDesignBar/ToolDesignBar';



const HomePage = () => {
    const {showToolDesignBar} = useSelector((state) => state.tool);
  return (
    <div className='w-screen h-screen relative bg-white px-4'> 
        <TopNavbar />
        
        <div className={`w-[202px] h-[536px] rounded-[10px] bg-white border border-grey-25 toolbar-shadow absolute top-[75px] left-1 transition-300 p-3 ${showToolDesignBar === true ? "block" : "hidden"} `}>
        <ToolDesignBar/>
         </div>
    </div>
  )
}

export default HomePage