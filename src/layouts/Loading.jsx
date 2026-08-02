import { useState } from "react";

export default function Loading() {


  //Stated used to know if the image has already been loaded.
  //We use this because when the images hasn't been loaded yet,
  //it shows the icon of a broken image.
  const [isLoaded, setIsLoaded] = useState(false);



  return (
    <>
      <div className="min-h-screen text-white text-center text-2xl
                      bg-linear-to-tr from-blue-400 to-indigo-950
                      justify-center items-center grid h-screen">

        <div>
          <img src="../img/scheduler_white.png"
               alt="logo"
               onLoad={() => setIsLoaded(true)}
               className="w-70 mx-auto"
               style={{ display: isLoaded ? 'block' : 'none' }}
                    />

          <span className="inline-block mt-10">Loading site...</span>
        </div>
      </div>
    </>
  )
}
