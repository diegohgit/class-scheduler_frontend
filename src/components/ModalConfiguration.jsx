import useSchool from "../hooks/useSchool";
import { useState, useRef, useEffect } from "react";
import { useContent, useChapterMutation } from "../hooks/useContent";
import TimeSelector from "./TimeSelector";

export default function ModalConfiguration() {

  const { handleModalConfiguration, } = useSchool();


  const handleSubmit = () => {
    console.log('HELLO')
  }



  return (
    <>
      <div className="flex m-4">
        <h2 className="text-center w-full text-2xl font-bold">
          Configuration
        </h2>

        <div className="flex justify-end">
          <button className="hover:cursor-pointer"
                  onClick={() => handleModalConfiguration() }>
            {/* "Close" icon  */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>



      <form onSubmit={(e) => handleSubmit(e)}
            className="w-11/12 mx-auto"
            onKeyDown={(e) => { if(e.key === 'Enter') handleSubmit(e); }}
      >
        <div className="w-10/12 mx-auto ">
          <span>Change active hours:</span>
          <div className="h-10 mt-4 flex">
            <div className="w-5/12 flex">
              <b className="mr-2">From:</b>
              <TimeSelector
                initialTime={'06:00'}
                auxiliar = "start"
              />
            </div>
            <div className="w-5/12 flex">
              <b className="ml-8 mr-2">To:</b>
              <TimeSelector
                initialTime={'22:00'}
                auxiliar = "end"
                />
            </div>
          </div>
        </div>

        <div className=" flex mt-2">
          <button type="button"
                  onClick={() => console.log("Cancel")}
                  className="button-base bg-red-500 hover:bg-red-600"
          >
            Cancel
          </button>

          <button type="submit"
                  className="button-base bg-indigo-500 hover:bg-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  )
}