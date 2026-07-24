import Class from "../components/Class";
import ModalClass from "../components/ModalClass";
import Modal from 'react-modal'
import useSchool from "../hooks/useSchool";
import { useState, useEffect } from "react";
import { days } from "../data/days";
import { toast } from "react-toastify";
import LoadingMessage from "../components/LoadingMessage";
import { useClasses } from "../hooks/useClasses";



Modal.setAppElement('#root')
export default function Home() {

  const { handleClickModal, modal, handleSetTime,
          handleClassModal, expanded, setExpanded,
          getDuration } = useSchool();

  const [ searchStudent, setSearchStudent ] = useState(0);



  //Get scheduled classes using useClasses()
  const { data:classes = [],
          isLoading,
          isSuccess,
          isError,
          error,
        } = useClasses();

  useEffect(() => {

    if(isSuccess && classes?.length === 0){
      toast.warning("You have no classes scheduled.");
    }
  }, [isSuccess, classes]);



  //Calculate height for a class or empty space.
  const getHeight = (durationMins, currentMinute) => {

    const spaceMinutes = currentMinute ? durationMins - currentMinute : durationMins;

    const spaceHeight = (Number(spaceMinutes)/60) * 100; 

    return spaceHeight.toFixed(2);
  }



  const hours = [7, 8, 9, 10, 11, 12];
  const blocksPerHr = 12;
  const endOfDay    = `${String(blocksPerHr).padStart(2, '0')}:55`;



  const findClasses = (day_id, hour, minute) => {

    const findClass = classes?.find(cls => {
      const nextStartHr = Number(cls.starts?.split(':')[0]);

      let nextStartMn = cls.starts?.split(':')[1];
          nextStartMn = String(nextStartMn).padStart(2, '0');

      return (
        nextStartHr === hour &&
        nextStartMn >= minute &&
        cls.days?.some((d) => d.id === day_id));
    })?? null;

    return findClass;
  }


  let print = false;
  let printMatch  = false;
  let isPrinting  = false;
  let matchActive = false;
  let spaceEnd    = "";
  let nextClassMin = "";



  return (
    <>
      {isLoading && <LoadingMessage text="Loading Classes..."/>}
      {isError   && <p className="text-center mt-40">Couldn't fetch classes.</p>}

      {isSuccess && Array.isArray(classes) &&
      (<div className="mt-15 grid grid-cols-8 gap-2">
        {/* Fixed time column */}
        <div className="w-20">
          <div className="text-center font-semibold bg-gray-300 
                          rounded">
            Time
          </div>
          {hours.map((hour) =>(
            <div
              key={hour}
              className="text-center h-20 font-medium
                       bg-gray-200 rounded"
            >
              {hour}:00
            </div>
          ))}
        </div>

        {/* Columns for days */}
        {days.map((day) => (

          <div key = {day.id}>
            <div className="text-center h-8 font-semibold
                   bg-gray-300 rounded">
              {day.label}
            </div>

            {/* Rows for time blocks */}
            {hours.map((hour) => (

              // Create an array
              // 12 blocks (representing each hour) of 5 minutes each one to divide the hour
              Array.from({ length: blocksPerHr }).map((value, i) => {

                // Calculate the minute for each block (0, 5, 10, ..., 55)
                // String.padStart is used to ensure that the minute
                // is always two digits (e.g., "00", "05"... "55")
                const minute = String(i * 5).padStart(2, '0');
                printMatch = false;
                const currentTime = String(hour).padStart(2, '0') + ':' + minute;
                let spaceHeight = 100;



                //VALIDATE IF THE CURRENT CYCLE IS THE START OF A CLASS
                //120-1416
                const match = minute === "00" || spaceEnd === currentTime 
                              ? findClasses(day.id, hour, minute) : null;



                if(match){

                  matchActive = true

                  //If the current time is the same as the begining of a class
                  //- Set to true all necessary variables to print a space.
                  //- Set spaceEnd.
                  //- Get class duration.
                  //- Get class duration.
                  if(currentTime === match.starts ){
                    isPrinting = printMatch = print = true;

                    spaceEnd = match.ends;

                    const classDuration = getDuration({starts: match.starts, ends: match.ends});
                    const totalClassMinutes = classDuration.$ms / 60000;//Convert miliseconds to minutes.

                    spaceHeight = getHeight(totalClassMinutes);
                  }
                  else print = false;

                }else{
                  // Check if an empty class should be printed.
                  if(matchActive === false && minute === "00"){isPrinting = false; print = true;}
                  else print = false;
                }



                //SPACE END
                //- Get space height 
                //- 
                //- Set spaceEnd.
                //-
                if(spaceEnd === currentTime){

                  if(match){
                    const nextClassStartMin = match?.starts?.split(':')[1];
                    spaceHeight = getHeight(nextClassStartMin, minute);

                  }else if(minute != '00'){
                    spaceHeight = getHeight(60, minute);
                  }

                  matchActive = !!match;

                  print = isPrinting = true;

                  printMatch = match?.starts === currentTime;
                  spaceEnd   = match ? match?.starts : hour+1 ,":00";

                //If we reach the column limit, reset 
                // print and matchActive values
                }else if(currentTime === endOfDay){
                  print = matchActive = false;
                }



                //RENDER AN EMPTY CLASS
                //(BEFORE THE START OF THE NEXT CLASS)
                if(isPrinting === false && matchActive && printMatch === false ){

                  const nextClassStartMin = match?.starts?.split(':')[1];

                  spaceHeight = getHeight(nextClassStartMin, minute);

                  spaceEnd = match?.starts;

                  //Store the minute when the next class starts
                  nextClassMin = nextClassStartMin;
                  print = isPrinting = true

                }else nextClassMin = ''; //Clean nextClassMin



                //Render a space
                if(print){

                  const emptyClassEnd = nextClassMin != '' ? nextClassMin : null;
                  const currTime      = hour.toString().padStart(2, '0')+':'+minute
                  const matchData     = printMatch ? match : null;

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
                        handleSetTime({day, currTime, emptyClassEnd, matchData});
                        handleClassModal(matchData);
                      }}
                    />
                  )
                }
              })
            ))}
          </div>
        ))}
      </div>)}

      <Modal isOpen={modal}  className= {`modal-base w-95 transition-all
                                          duration-300 ease-in-out
                                          ${expanded ? "h-110" : "h-95"}
                                        `}>
          <ModalClass />
      </Modal>
    </>
  )
}
