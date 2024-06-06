import React, { useEffect, useState } from 'react'

const SharedImage = ({socket, newColor}) => {
    const [img, setImg] = useState(null);

    useEffect(() => {
      socket.on("whiteBoardDataResponse", (data) => {
        setImg(data.imageURL);
      });
    },[]);
    
      return (
      <div className='w-screen h-screen flex justify-center items-center'>
             <img
          src={img}
          alt="Screen shared by the Presenter"
          className={`w-full h-auto xl:w-[80%] object-cover `}
          style={{
            backgroundColor: newColor
          }}
        />
      </div>
      );
  
}

export default SharedImage