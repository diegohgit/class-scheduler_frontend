import Class from "../components/Class";
import ModalClass from "../components/ModalClass";
import Modal from 'react-modal'
import useSchool from "../hooks/useSchool";
import { useState, useEffect } from "react";
import { days } from "../data/days";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

Modal.setAppElement('#root')
export default function Home() {

  const { handleClickModal, modal, handleSetTime,
          handleClassModal, fetchClassesReactQuery, /*classes*/ } = useSchool();

  const { data:classes = [],
          isLoading,
          isSuccess,
          isError,
          error,
  } = useQuery({ 
        queryKey:  ["classes"],
        queryFn:   fetchClassesReactQuery,
        staleTime: Infinity,
        gcTime:    1000 * 60 * 90,//1hr 30min
      });


  useEffect(() => {

    if(isError){
      toast.error(error?.message || "Something went wrong.");
    }
  }, [isError, error]);
                  
  const [ searchStudent, setSearchStudent ] = useState(0);

  //function to calculate the space before each class
  const spaceBeforeClass = (startMinute) => {
    const classHeightBC = startMinute <= 5  ? 'h-2' :
                          startMinute <= 10 ? 'h-4' :
                          startMinute <= 20 ? 'h-8' :
                          startMinute <= 30 ? 'h-10' :
                          startMinute <= 40 ? 'h-12' :
                          startMinute <= 50 ? 'h-16' :
                          startMinute <= 55 ? 'h-18' :
                          '';

    return classHeightBC;
  }

  //function to calculate tlhe space after each class
  const spaceAfterClass = (endingMinute) => {
    const classHeightAC = endingMinute <= 5  ? 'h-18' :
                          endingMinute <= 10 ? 'h-16' :
                          endingMinute <= 20 ? 'h-12' :
                          endingMinute <= 30 ? 'h-10' :
                          endingMinute <= 40 ? 'h-8' :
                          endingMinute <= 50 ? 'h-4' :
                          endingMinute <= 55 ? 'h-2' :
                          '';

    return classHeightAC;
  }

  const hours = [7, 8, 9, 10, 11];
  const blocksPerHr = 12;

  let print = 0;
  let matchActive  = 0;
  let matchEnds    = 0;
  let nextClassMin = '';

  return (
    <>
      <div className="mt-15 grid grid-cols-8 gap-2">
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
              // Create an array (12 blocks of 5 minutes each one to divide the hour)
              Array.from({ length: blocksPerHr }).map((value, i) => {

                // Calculate the minute for each block (0, 5, 10, ..., 55)
                // String.padStart is used to ensure that the minute 
                // is always two digits (e.g., "00", "05"... "55")
                const minute = String(i * 5).padStart(2, '0');

                //VALIDATE IF THE CURRENT CYCLE IS THE START OF A CLASS
                const match = classes?.find(cls => {
                        // Split the hour string of the class into hours and minutes
                        const [h, m] = cls.starts.split(':').map(Number);

                        // With this instruction we define the block in which it starts
                        const blockStart = String(m).padStart(2, '0');

                        // Validate if the current cycle (hour and minute) matches the start of a class
                        return h === hour && blockStart === minute && cls.day_id === day.id;
                      }) ?? null;

                //let classHeight = match ? match.height : 'h-20';
                let classHeight = 'h-20';

                const isHighLighted = match && searchStudent == match.student_id ? 1 : 0;

                // If we have a match, we activate matchActive
                // and get the matchEnds from the class.
                if(match){
                  matchActive = 1;
                  matchEnds	= match.ends;
                }else{
                  // Check if we should print an empty class
                  print = matchActive == 0 && minute == 0 ? 1 : 0;
                }

                // DEFINING CLASS-ENDS
                if(matchActive){
                  let [h, m] = matchEnds.split(':').map(Number);

                  //Define when we are at the classEnds point
                  const nextClassMin  = String(m).padStart(2, '0');
                  const classEnds = h +':'+ nextClassMin === hour +':'+ minute ? 1 : 0

                  if(classEnds) {
                    // Deactivate matchActive and activate print
                    print = 1;
                    matchActive = 0;

                    // DEFINING HEIGHT OF EMPTY CLASS
                    // (BEFORE THE START OF THE NEXT CLASS)
                    if(minute != '00'){
                      classHeight = spaceAfterClass(nextClassMin);										
                    }
                  
                  //If we reach the column limit, reset 
                  // print and matchActive values
                  }else if(hour +':'+ minute == '11:55'){
                    print = 0;
                    matchActive = 0;
                  }
                }

                //RENDER AN EMPTY CLASS
                if(print && matchActive == 0){
                  //DEFINING HEIGHT OF EMPTY CLASS
                  //(BEFORE THE START OF THE NEXT CLASS)
                  //Search for the next class getting just the hour part of "starts"
                  //and compare if it matches with the current hour
                  //Example: if we are in the 08:10 block, we look for a class in the 
                  // same hour range, like 08:30
                  const nextClass = classes.filter(cls => cls.starts.split(':')[0] == hour
                                                          && cls.day_id === day.id);

                  if(nextClass[0]){
                    const startMinute = nextClass[0].starts.split(':')[1];

                    classHeight = spaceBeforeClass(startMinute);

                    //Store the minute when the next class starts
                    nextClassMin = startMinute;
                  }else{nextClassMin = '';}//Clean nextClassMin
                }

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
                      isHighLighted = { isHighLighted }
                      classHeight   = { classHeight }
                      onClick = {() => {
                        handleClickModal();
                        handleSetTime({day, currTime, emptyClassEnd, match});
                        handleClassModal(match);
                        //handleSetSearch({match})
                      }}
                    />
                  )
                }
              })
            ))}
          </div>
        ))}
      </div>

      <Modal isOpen={modal}  className="modal-base w-95 h-80">
          <ModalClass />
      </Modal>
    </>
  )
}
