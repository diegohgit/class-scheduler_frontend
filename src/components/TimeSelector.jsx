import { useState, useEffect, useRef } from "react";
import useSchool from "../hooks/useSchool";



export default function TimeSelector({initialTime, auxiliary}) {

  const { setTime, expanded, setExpanded } = useSchool();



  //States to define if the hour/minute selector will be shown.
  const [showHr, setShowHr]   = useState(0);
  const [showMin, setShowMin] = useState(0);
  //Get hour and minute from the initialTime prop.
  const [h, m] = initialTime.split(':').map(Number);



  //States to handle the selected hour and minute.
  const [selHr,  setSelHr]  = useState(h.toString().padStart(2, '0'));
  const [selMin, setSelMin] = useState(m.toString().padStart(2, '0'));

  //State to show the selected time.
  const [selTime, setSelTime] = useState(selHr+':'+selMin);

  //Format selHr so that it doesn't show '24' as an hour
  useEffect(() => {

    const hr24 = selHr === "24" ? "00" : selHr;

    setSelTime(hr24+":"+selMin)

  },[selHr])



  //Update 'time' state to calculate 'duration' state.
  useEffect(() => {

    //Modify only 'starts' or only 'ends' from the time state.
    if(auxiliary === "start")    setTime(prev => ({...prev, 'starts': selTime}));
    else if(auxiliary === "end") setTime(prev => ({...prev, 'ends': selTime}));

  }, [selTime, auxiliary]);



  //State to manage the showing/hidding of time selector
  //when user clicks outside of it.
  const divHrRef  = useRef(null);
  const divMinRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event){
      //divHrRef.current is used to validate if the current div exists.
      //This must be validated before the second condition
      //because if divHrRef.current is null the app would crush
      //when the second condition is being be read.
      //event.target is the element that was clicked, so we check if
      //the element clicked was inside or outside divHrRef
      if(divHrRef.current && !divHrRef.current.contains(event.target)){
        setShowHr(0);
      }
      
      if(divMinRef.current && !divMinRef.current.contains(event.target)){
        setShowMin(0);
      }
    }

    //If showHr or showMin are active
    //add the "mousedown" event listener to the document
    //if user does a mousedown on any part of document, run handleClickOutside()
    if(showHr || showMin){
      document.addEventListener("mousedown", handleClickOutside);
    }

    //Cleanup function
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHr, showMin]);



  //Render the time selector title. Example: "Select Hour"
  const getTittle = (title) => {
    return <div className="relative flex items-center">
              <p className="w-full text-center font-bold ">Select {title}</p>

              {/*Time selector close button*/}
              <button 
                type="button"
                className="absolute h-6 right-0 hover:bg-gray-200 hover:cursor-pointer"
                onClick={() => {
                          setShowHr(0);
                          setShowMin(0);
                          setSelHr(h.toString().padStart(2, '0'))
                        }}
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                  viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className="w-6 h-6 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
           </div>
  }



  return (
    <>
      {/*Div to show selected time*/}
      <div  className={`${showHr ? 'opacity-0' : 'opacity-100'}
                       gap-1 flex hover:cursor-pointer
                       transition-opacity duration-300`}
            onClick={() => {setShowHr(1);
                            if(expanded) setExpanded(false);
                            }}
      >
        <p className=" underline underline-offset-2">
          {selTime}
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </div>



      {/*Div to show the HOUR selector*/}
      <div  ref={divHrRef}
            className={`${showHr ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
                      border-2 border-sky-200 bg-white 
                      shadow-xl rounded w-40
                      absolute z-50 bottom-3
                      transition-opacity duration-300`}
      >
        {getTittle("Hour")}
        {/*Grid to show hours*/}
        <div className="grid grid-cols-6">
          { Array.from({ length: 24 }).map((value, i) => {

            const hour = i.toString().padStart(2, '0');
            return  <button
                      type="button"
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
      <div  ref={divMinRef}
            className={`${showMin ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
                      border-2 border-sky-200 bg-white 
                      shadow-xl rounded w-40
                      absolute z-50 bottom-3
                      transition-opacity duration-300`}
      >
        {getTittle("Minute")}
        {/*Grid to show minutes*/}
        <div className="grid grid-cols-3">
          { Array.from({ length: 12 }).map((value, i) => {
            const every5Min = i*5;
            const minute = every5Min.toString().padStart(2, '0');
            return  <button
                      type="button"
                      key={minute}
                      className={`${ minute === selMin ? 'bg-sky-400' : '' }
                                  border border-sky-200 h-7 
                                hover:bg-sky-200 hover:cursor-pointer`}
                      onClick={() => {
                        setSelMin(minute);
                        setSelTime(selHr+':'+minute);
                        setShowMin(0);
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
