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

    const classHeight = (Number(spaceMinutes)/60) * 100; 

    return classHeight.toFixed(2);
  }



  const hours = [7, 8, 9, 10, 11, 12];
  const blocksPerHr = 12;
  const endOfDay    = `${String(blocksPerHr).padStart(2, '0')}:55`;

  let print = 0;
  let matchActive  = 0;
  let matchEnds    = 0;
  let nextClassMin = '';



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

                //VALIDATE IF THE CURRENT CYCLE IS THE START OF A CLASS
                const match = classes?.find(cls => {
                        //add +1Hr to the current time, 
                        //if theres a class in that range pritn = 1;


                        // Split the hour string of the class into hours and minutes
                        const [h, m] = cls.starts?.split(':').map(Number) || [];

                        // With this instruction we define the block in which it starts
                        const blockStart = String(m).padStart(2, '0');

                        // Validate if the current cycle (day, hour and minute) 
                        // matches the start of a class.
                        return (
                          h === hour && 
                          blockStart === minute && 
                          cls.days?.some((d) =>d.id === day.id)
                        );
                      });

                let classHeight = 100;

                // If we have a match, we activate matchActive
                // and get the matchEnds from the class.
                if(match){
                  matchActive = 1;
                  matchEnds	  = match.ends;

                  const classDuration = getDuration({starts: match.starts, ends: match.ends});
                  const totalClassMinutes = classDuration.$ms / 60000;//Convert miliseconds to minutes.

                  classHeight = getHeight(totalClassMinutes);

                }else{
                  // Check if we should print an empty class
                  print = matchActive == 0 && minute == 0 ? 1 : 0;
                }



                // DEFINING CLASS-ENDS
                if(matchActive){

                  //Format current time in a '09:00' format.
                  const currentTime = String(hour).padStart(2, '0') + ':' + minute;

                  const classEnds = matchEnds === currentTime;

                  if(classEnds) {
                    //Deactivate matchActive and activate print.
                    print = 1;
                    matchActive = 0;

                    //DEFINING HEIGHT OF EMPTY CLASS
                    //(BEFORE THE START OF THE NEXT CLASS)
                    if(minute != '00'){
                      classHeight = getHeight(60, minute);
                    }

                  //If we reach the column limit, reset 
                  // print and matchActive values
                  }else if(hour +':'+ minute === endOfDay){
                    print = 0;
                    matchActive = 0;
                  }
                }



                //RENDER AN EMPTY CLASS
                if(print && matchActive == 0){
                  //DEFINING HEIGHT OF EMPTY CLASS
                  //(BEFORE THE START OF THE NEXT CLASS)
                  //Search for the next class that matches with the current hour
                  //and is more than a minute later than the current minute.
                  //Example: If we are in the 08:10 block, we look for a class in the 
                  //         same hour range, like 08:30, 8:45...
                  const nextClass = classes?.find(cls => {
                                      const nextStartHr = Number(cls.starts?.split(':')[0]);
                                      const nextStartMn = Number(cls.starts?.split(':')[1]);

                                      return (
                                        nextStartHr === hour &&
                                        nextStartMn > minute &&
                                        cls.days?.some((d) => d.id === day.id));
                                    });

                  if(nextClass){

                    const nextClassStartMin = nextClass?.starts?.split(':')[1];
                    classHeight = getHeight(nextClassStartMin, minute);

                    //Store the minute when the next class starts
                    nextClassMin = nextClassStartMin;
                  }else{nextClassMin = '';}//Clean nextClassMin
                }



                //Render a space
                if(match || print){
                  const emptyClassEnd = nextClassMin != '' ? nextClassMin : null;
                  const currTime = hour.toString().padStart(2, '0')+':'+minute
                  return(
                    <Class
                      key    = {`${day.id}-${hour}-${minute}`}
                      minute = { minute }
                      hour   = { hour }
                      day    = { day }
                      match  = { match }
                      classHeight   = { classHeight }
                      onClick = {() => {
                        handleClickModal();
                        handleSetTime({day, currTime, emptyClassEnd, match});
                        handleClassModal(match);
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
