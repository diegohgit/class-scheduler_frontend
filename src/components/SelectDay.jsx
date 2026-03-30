import { useEffect, useRef, useState } from "react"
import useSchool from "../hooks/useSchool";
import { days } from "../data/days";

//This component is used to display and modify data.
//When its displaying data the user can click on it
//and it will switch to a select usefull to pick the class day.
export default function SelectDay() {

  //Show if the class day is today.
  const { today, selDay, setSelDay } = useSchool();
  const hiddenToday = selDay.label != today ? 'hidden' : '';

  //Hide select when user clicks outside of it.
  //For more information see TimeSelector.jsx comments.
  const [ showSelect, setShowSelect ] = useState(0)
  const selectRef = useRef(null);
  useEffect(() =>{
    function handleClickOutside(event){
      if(selectRef.current && !selectRef.current.contains(event.target)){
        setShowSelect(0);
      }
    }

    if(showSelect){
      document.addEventListener("mousedown", handleClickOutside);
      selectRef.current.showPicker();//Show all select options.
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [showSelect]);

  return (
    <>
      {/* Display class day
        - This div will be hidden when the user is in edit mode.
      */}
      <div  className={`${showSelect ? 'hidden' : ''}
                        flex hover:cursor-pointer`}
            onClick={() => setShowSelect(1)}
      >
        <p className="underline underline-offset-2 mr-2">
          {selDay.label}
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
        {/* Show a label to show if the class will be today */}
        <p className={`${hiddenToday} ml-2`}>(Today)</p>
      </div>

      {/* Select with list of days */}
      <select 
        ref={selectRef}
        name='day_id'
        className={`${showSelect ? '' : 'hidden'}`}
        defaultValue={selDay.id}
      >
        {/* Render select options */}
        {days.map((day) => {
          return  <option 
                    key={day.id}
                    value={day.id}
                    className="h-8 hover:bg-sky-200 hover:cursor-pointer"
                    onClick={() => setSelDay(day)}
                  >
                    {day.label}
                  </option>
          })
        }
      </select>
    </>
  )
}
