import { useState } from "react";

export default function TimeSelector({initialTime}) {

  //States to define if the hour/minute selector will be shown.
  const [showHr, setShowHr]   = useState(0);
  const [showMin, setShowMin] = useState(0);

  //Get hour and minute from the initialTime prop.
  const [h, m] = initialTime.split('.').map(Number);

  //States to handle the selected hour and minute.
  const [selHr,  setSelHr]  = useState(h.toString().padStart(2, '0'));
  const [selMin, setSelMin] = useState(m.toString().padStart(2, '0'));

  //State to show the selected time.
  const [time, setTime] = useState(selHr+':'+selMin);

  return (
    <>
      {/*Div to show selected time*/}
      <div  className={`${showHr ? 'opacity-0' : 'opacity-100'}
                       gap-1 flex hover:cursor-pointer
                       transition-opacity duration-300`}
            onClick={() => setShowHr(1)}
      >
        <p className=" underline underline-offset-2">
          {time}
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </div>

      {/*Div to show the HOUR selector*/}
      <div className={`${showHr ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
                      border-2 border-sky-200 bg-white 
                      shadow-xl rounded absolute 
                      w-40 bottom-3 transition-opacity duration-300`}
      >
        <p className="text-center font-bold ">Select Hour</p>
        {/*Grid to show hours*/}
        <div className="grid grid-cols-6">
          { Array.from({ length: 24 }).map((value, i) => {

            const hour = i.toString().padStart(2, '0');
            return  <button 
                      key={hour}
                      className={`${ hour === selHr ? 'bg-sky-200' : '' }
                                  border border-sky-200 h-7 
                                hover:bg-sky-200 hover:cursor-pointer`}
                      onClick={() => {
                                setShowHr(0);
                                setShowMin(1);
                                setSelHr(hour);
                              }
                            }
                    >
                        {hour}
                    </button>;
            })
          }
        </div>
      </div>

      {/*Div to show the MINUTE selector*/}
      <div className={`${showMin ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
                      border-2 border-sky-200 bg-white 
                      shadow-xl rounded absolute 
                      w-40 bottom-3 transition-opacity duration-300`}
      >
        
        <p className="text-center font-bold ">Select Minute</p>
        {/*Grid to show minutes*/}
        <div className="grid grid-cols-3">
          { Array.from({ length: 12 }).map((value, i) => {
            const every5Min = i*5;
            const minute = every5Min.toString().padStart(2, '0');
            return  <button 
                      key={minute}
                      className={`${ minute === selMin ? 'bg-sky-200' : '' }
                                  border border-sky-200 h-7 
                                hover:bg-sky-200 hover:cursor-pointer`}
                      onClick={() => {
                                setShowMin(0);
                                setSelMin(minute);
                                setTime(selHr+':'+minute);
                              }}
                    >
                        {minute}
                    </button>;
            })
          }
        </div>
      </div>
    </>
  )
}
