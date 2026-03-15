import useSchool from "../hooks/useSchool";
import { useState } from 'react';
import DivInput from "./DivInput";
import TimeSelector from "./TimeSelector";

export default function ModalClass() {

  const { time, handleClickModal, classModal, today } = useSchool();
  const [duration, setDuration] = useState(0);

  const studentsName = classModal?.student || null;
  const hiddenToday  = classModal?.dayLabel != today ? 'hidden' : '';
  const start = classModal?.hour || time[0].time ;
  const ends  = classModal?.ends || time[0].ends;	

  return (
    <>
      <div className="flex mb-5">
        <h2 className="w-11/12 text-2xl font-bold">Class Information</h2>
        <div className="flex justify-end">
          <button 
            className="hover:cursor-pointer"
            onClick={handleClickModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
              viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <div className="h-15">
          <b>Student:</b>
          <DivInput
            info = {studentsName}
          />
        </div>
        <div className="flex mt-2">
          <b className="mr-2">Day:</b> {time[0].day.label} 
          <p className={`${hiddenToday} ml-2`}>(Today)</p>
        </div>
        <div className="h-10 mt-3 flex">
          <div className="w-5/12 flex">
            <b className="mr-2">Start:</b>
            <TimeSelector 
              initialTime={start}
            />
          </div>
          <div className="w-5/12 flex">
            <b className="ml-8 mr-2"> Ends:</b>
            <TimeSelector 
              initialTime={ends}
            />
          </div>
        </div>
        <div className="flex">
          <b className="mr-2">Duration: </b>
          <p className="mr-1">60 mins</p>
        </div>
      </div>

      <div>
        <button className="button-base bg-red-500 hover:bg-red-600">
          Cancel Class
        </button>
        <button className="button-base bg-indigo-500 hover:bg-indigo-600">
          Ok
        </button>
      </div>
    </>
  )
}