import Class from "../components/Class";
import ModalClass from "../components/ModalClass";
import Modal from 'react-modal'
import useSchool from "../hooks/useSchool";
import { useState } from "react";
import { classes } from "../data/classes";

Modal.setAppElement('#root')
export default function Home() {

  const { customStyles, handleClickModal, modal, handleSetTime, handleClassModal } = useSchool();
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


  const days = [
          {id:1	, label:"Monday"},
          {id:2	, label:"Tuesday"},
          {id:3	, label:"Wednesday"},
          {id:4	, label:"Thursday"},
          {id:5	, label:"Friday"},
          {id:6	, label:"Saturday"},
          {id:7	, label:"Sunday"}
         ];

  const hours = [7, 8, 9, 10, 11];

  const blocksPerHr = 12;
  let print = 0;
  let matchActive = 0;
  let matchEnds   = 0;

  return (
    <>
      <div className="grid grid-cols-8 gap-2">
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
              // Create an array (12 blocks of 5 minutes each)
              Array.from({ length: blocksPerHr }).map((value, i) => {

                // Calculate the minute for each block (0, 5, 10, ..., 55)
                // String.padStart is used to ensure that the minute 
                // is always two digits (e.g., "00", "05"... "55")
                const minute = String(i * 5).padStart(2, '0');

                //VALIDATE IF THE CURRENT CYCLE IS THE START OF A CLASS
                const match = classes.find(cls => {
                        // Split the hour string of the class into hours and minutes
                        const [h, m] = cls.hour.split('.').map(Number);

                        // With this instruction we define the block in which it starts
                        const blockStart = String(m).padStart(2, '0');

                        // Validate if the current cycle (hour and minute) matches the start of a class
                        return h === hour && blockStart === minute && cls.day === day.id;
                      }) ?? null;

                let classHeight = match ? match.height : 'h-20';
                const isHighLighted = match && searchStudent == match.student_id ? 1 : 0;

                // If we have a match, we activate matchActive
                // and get the matchEnds from the class.
                if(match){
                  matchActive = 1;
                  matchEnds	= match.ends
                }else{
                  // Check if we should print an empty class
                  print = matchActive == 0 && minute == 0 ? 1 : 0;
                }

                // DEFINING CLASS-ENDS
                if(matchActive){
                  let [h, m] = matchEnds.split('.').map(Number);

                  const blockEnd  = String(m).padStart(2, '0');
                  const classEnds = h +'.'+ blockEnd === hour +'.'+ minute ? 1 : 0

                  if(classEnds) {
                    // If the current cycle matches a classEnds
                    // we deactivate matchActive and activate print
                    // to now print an empty class
                    print = 1;
                    matchActive = 0;

                    // DEFINING HEIGHT OF EMPTY CLASS
                    // (BEFORE THE START OF THE NEXT CLASS)
                    // We get the minute in which the class ended
                    // to define the height of the empty class
                    // exclude the 00 because that case
                    // already has a height defined previously ('h-20')
                    if(minute != '00'){
                      //Defining the classHeight variable 
                      //Example: if the class ends at 8:20
                      // the next block will have class classHeight = 'h-15' 
                      // thus representing the space left 
                      // between 8:20 and 9:00
                      classHeight = spaceAfterClass(blockEnd);										
                    }
                  
                  //If we reach the column limit, reset 
                  // print and matchActive values
                  }else if(hour +'.'+ minute == '11.55'){
                    print = 0;
                    matchActive = 0;
                  }
                }

                //RENDER AN EMPTY CLASS
                if(print && matchActive == 0){
                  //DEFINING HEIGHT OF EMPTY CLASS
                  //(BEFORE THE START OF THE NEXT CLASS)
                  //We obtain the next class that matches
                  //the current cycle hour and day.
                  const nextClass = classes.filter(cls => cls.hour.split('.')[0] == hour
                                                         && cls.day === day.id);

                  if(nextClass[0]){
                    //Obtaining the minute in which the next class starts
                    const startMinute = nextClass[0].hour.split('.')[1];

                    //Defining the height that the empty class box will have
                    // taking as reference the minute in which the class starts.
                    classHeight = spaceBeforeClass(startMinute);
                  }
                }

                if(match || print){
                  return(
                    <Class 
                      key  = {`${day.id}-${hour}-${minute}`}
                      minute = { minute }
                      hour = { hour }
                      day  = { day }
                      match  = { match }
                      isHighLighted = { isHighLighted }
                      classHeight = { classHeight }
                      onClick = {() => {
                        handleClickModal(),
                        handleSetTime({hour, day})
                        handleClassModal(match)
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


      <Modal isOpen={modal} style={customStyles}>
          <ModalClass />
      </Modal>

    </>
  )
}
