import Class from "../components/Class";
import ModalClass from "../components/ModalClass";
import ModalConfiguration from "../components/ModalConfiguration";
import Modal from 'react-modal'
import useSchool from "../hooks/useSchool";
import { useEffect } from "react";
import { days } from "../data/days";
import { toast } from "react-toastify";
import LoadingMessage from "../components/LoadingMessage";
import { useClasses } from "../hooks/useClasses";
import { useActiveHours } from "../hooks/useActiveHours";



Modal.setAppElement('#root')
export default function Home() {

  //Get active hours using useActiveHours()
  const { data:active_hours = {},
          isLoading : isLoadingActiveHrs,
          isSuccess : isSuccessActiveHrs,
          isError   : isErrorActiveHrs,
        } = useActiveHours();



  //Get only the hour in numeric format.
  const fromHr = active_hours?.from  ? Number(active_hours.from.split(':')[0])  : null;
  const until  = active_hours?.until ? Number(active_hours.until.split(':')[0]) : null;
  //If until = midnight, handle it as 24 instead of 0
  //so the algorithm can render until the 24 hour.
  const untilHr = until === 0 ? 24 : until;

  const fromMin  = active_hours?.from  ? Number(active_hours.from.split(':')[1])  : null;
  const untilMin = active_hours?.until ? Number(active_hours.until.split(':')[1]) : null;



  const { handleClickModal, modal, handleSetTime,
          handleClassModal, expanded, getDuration,
          modalConfiguration, handleModalConfiguration,
        } = useSchool();



  //Get scheduled classes using useClasses()
  const { data:classes = [],
          isLoading : isLoadingClasses,
          isSuccess : isSuccessClasses,
          isError   : isErrorClasses,
        } = useClasses();

  useEffect(() => {

    if(isSuccessClasses && classes?.length === 0){
      toast.warning("You have no classes scheduled.");
    }
  }, [isSuccessClasses, classes]);



  //Calculate height for a class or empty space.
  const getHeight = (durationMins, currentMinute) => {

    const spaceMinutes = currentMinute ? durationMins - currentMinute : durationMins;

    const spaceHeight = (Number(spaceMinutes)/60) * 100; 

    return spaceHeight.toFixed(2);
  }



  //String().padStart is used to ensure that time
  //is always shown in a two digits format (e.g., "00", "05"... "55")
  const getFormattedTime = (time) => {

    return String(time).padStart(2, '0');
  }



  //Search for a class in the current hour.
  const findClasses = (day_id, hour, minute) => {

    const findClass = classes?.find(cls => {
      const nextStartHr = Number(cls.starts?.split(':')[0]);

      let nextStartMn = cls.starts?.split(':')[1];
          nextStartMn = getFormattedTime(nextStartMn);

      return (
        nextStartHr === hour &&
        nextStartMn >= minute &&
        cls.days?.some((d) => d.id === day_id));
    })?? null;

    return findClass;
  }



  //Variables useful to render the schedule.
  let isPrinting = false;
  let spaceEnd   = null;

  const blocksPerHr = 12;
  const startOfDay  = active_hours.from;
  const extraBlock  = untilMin > 0 ? 1 : 0;//if untilMin > 0 add an extra block to the schedule.



  return (
    <>
      {(isLoadingClasses || isLoadingActiveHrs)
        && <LoadingMessage text="Loading Classes..."/>}

      {(isErrorClasses || isErrorActiveHrs)
        && <p className="text-center mt-40">Couldn't fetch classes.</p>}



      {/* Topbar for days */}
      <div className="w-full fixed mt-18 
                      h-8 left-1/2 
                      -translate-x-1/2 -translate-y-1/2 
                    bg-white/50 backdrop-blur-sm
                      shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] ">

        <div className="w-[1000px] mx-auto text-center 
                        grid grid-cols-7 font-bold ">
           {days.map((day) => (
              <span key={day.id}>{day.label}</span>)
            )}
        </div>
      </div>



      {/* Grid starts */}
      {isSuccessClasses && isSuccessActiveHrs && Array.isArray(classes) &&
      (<div className="w-[1000px] mx-auto mt-24
                       mb-4 grid grid-cols-7">

        {/* Columns for days */}
        {days.map((day) => (
          <div key = {day.id}>


            {/* Calculate how many hours will be rendered */}
            {Array.from({length: extraBlock + untilHr - fromHr }).map((_, hr) => {

              //Start from fromHr + hr
              //It's something similar to start i=5 instead of i=0
              //in this case would be fromHr=7; 7+1, 7+2, 7+3...
              const hour = fromHr + hr;

              // Create an array
              // 12 blocks (representing each hour) of 5 minutes each one to divide the hour
              return Array.from({ length: blocksPerHr }).map((_, i) => {

                // Calculate the minute for each block (0, 5, 10, ..., 55).
                // If the current cicle is in the first hr, 
                // take the fromMin and add the current index (i * 5).
                const preMinute = hour === fromHr ? fromMin + (i * 5) : i * 5;

                const minute = getFormattedTime(preMinute);

                //Reset variables
                let print       = false;
                let printMatch  = false;
                let endSpaceMin = null;
                let spaceHeight = 100;
                const currentTime = getFormattedTime(hour) + ":" + minute;

                //Use this to log specific parts of the cycle.
                //if(day.id === 1 && currentTime === "09:15")console.log("spaceEnd", spaceEnd)



                //SEARCH FOR NEW CLASSES.
                const match = currentTime === spaceEnd || currentTime === startOfDay
                              ? findClasses(day.id, hour, minute) : null;



                //PRINT A CLASS.
                //If the current time is the same as the begining of a class
                //- Set to true all necessary variables to print a space.
                //- Get class duration.
                //- Set spaceEnd.
                if(currentTime === match?.starts ){

                    isPrinting = printMatch = print = true;

                    const classDuration = getDuration({starts: match.starts, ends: match.ends});
                    const totalClassMinutes = classDuration.$ms / 60000;//Convert miliseconds to minutes.

                    spaceHeight = getHeight(totalClassMinutes);
                    spaceEnd    = match.ends;
                }



                //PRINT A BLANK SPACE
                //- Set variables to print blank spaces.
                if(currentTime === spaceEnd || currentTime === startOfDay)
                {
                  //If a match has been detected,
                  //calculate height of a blank space
                  //BEFORE rendering the match space.
                  if(match && currentTime != match.starts){

                    const nextClassStartMin = match.starts?.split(':')[1];

                    spaceHeight = getHeight(nextClassStartMin, minute);
                    endSpaceMin = nextClassStartMin;

                    //The current space will finish where the match starts.
                    spaceEnd = match.starts
                  }


                  //Calculate height of a blank space.
                  //Empty hours and last spaces in the schedule.
                  if(!match){
                    spaceHeight = hour === untilHr ? getHeight(untilMin, minute) : getHeight(60, minute);
                    endSpaceMin = hour === untilHr ? untilMin : null;

                    spaceEnd = getFormattedTime(hour + 1) +":00";
                  }

                  print = isPrinting = true;
                }



                //Render a space.
                if(print){

                  //Store info in a constant to send the 
                  //correspondent information to other functions.
                  const finalSpaceMin = endSpaceMin;
                  const matchData = printMatch ? match : null;

                  return(
                    <Class
                      key    = {`${day.id}-${hour}-${minute}`}
                      minute = { minute }
                      hour   = { hour }
                      day    = { day }
                      match  = { matchData }
                      spaceHeight = { spaceHeight }
                      onClick = {() => {
                        handleClickModal();
                        handleSetTime({day, currentTime, finalSpaceMin, matchData});
                        handleClassModal(matchData);
                      }} 
                    />
                  )
                }
              })
            })}
          </div>
        ))}
      </div>)}


      <div className="w-full flex justify-center">
        <button className="button-base bg-indigo-500 hover:bg-indigo-600"
                onClick={() => handleModalConfiguration()}
        >
          Configuration
        </button>
      </div>

      <Modal isOpen={modal}  className= {`modal-base w-95 transition-all
                                          duration-300 ease-in-out
                                          ${expanded ? "h-110" : "h-95"}`}>
          <ModalClass />
      </Modal>

      <Modal isOpen={modalConfiguration} className="modal-base w-95 h-55">
          <ModalConfiguration />
      </Modal>
    </>
  )
}