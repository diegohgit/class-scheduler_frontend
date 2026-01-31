import Class from "../components/Class";
import ModalClass from "../components/ModalClass";
import Modal from 'react-modal'
import useSchool from "../hooks/useSchool";
import { useState } from "react";

Modal.setAppElement('#root')
export default function Home() {

  const { customStyles, handleClickModal, modal, handleSetTime, handleClassModal } = useSchool();
  const [ searchStudent, setSearchStudent ] = useState(0);

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
  const clases = [
        {day: 1, dayLabel:"Monday", hour: '7.15',  last: 90, ends: '8.10',  height:'h-20', student_id: 1, student: 'Diego Hernández Hernández'},
        {day: 3, dayLabel:"Wednesday", hour: '9.00',  last: 60, ends: '10.00', height:'h-20', student_id: 3, student: 'Marcela Alejandra Perez Briones Briones Briones' },
        {day: 2, dayLabel:"Tuesday", hour: '11.00', last: 60, ends: '12.00', height:'h-20', student_id: 2, student: 'Carolina Alvarado Estudillo'},
        {day: 6, dayLabel:"Saturday", hour: '10.00', last: 90, ends: '11.00', height:'h-20', student_id: 1, student: 'Diego Hernández Hernández'},
      ];

  const blocksPerHr = 6;
  let print = 0;
  let matchActive = 0;
  let matchEnds = 0;
  return (
    <>
      <div className="grid grid-cols-8 gap-4">
        {/* Fixed time column */}
        <div className="w-20">
          <div className="text-center font-semibold bg-gray-300 
                  p-1 rounded">
            Time
          </div>
          {hours.map((hour) =>(
            <div
              key={hour}
              className="text-center h-20 font-medium
                    bg-gray-200 my-0.5 rounded"
            >
              {hour}:00
            </div>
          ))}
        </div>

        {/* Columns for days */}
        {days.map((day) => (
          <div 
            key = {day.id}
            className="grid hover:bg-indigo-200"
          >
            <div className="text-center h-8 font-semibold
                   bg-gray-300 rounded">
              {day.label}
            </div>

            {/* Rows for time blocks */}
            {hours.map((hour) => (
              // Simulate an array using Array.from to create subBlocks
              // and divide each 1Hr block into 6 subBlocks
              // We don't use the "value" variable but it's necessary
              // to define the counter i
              Array.from({ length: blocksPerHr }).map((value, i) => {

                // Each cycle multiplies the counter *10
                // to get minutes in series of 10
                // padStart is to fill a string
                // from the left to complete 2 digits
                // we need it so that when the counter = 0
                // it gives us a string '00' instead of '0'
                // which we can compare later
                const minute = String(i * 10).padStart(2, '0');
                const minuteMatch = i * 10;

                //VALIDATE IF THE CURRENT CYCLE IS THE START OF A CLASS
                // comparing the start hour of each class with
                // the current cycle hour
                const match = clases.find(cls => {
                        const [h, m] = cls.hour.split('.').map(Number);

                        // Whit this instruction we define the block in which it starts
                        // for example 07:13, 13 we divide by 10 gives us .13
                        // and multiplying by 10 gives us 10 when rounding with Math.floor
                        const blockStart = Math.floor(m / 10) * 10;

                      // To get the result we compare the hour of the class
                      // with the current cycle hour
                      // the current cycle minute (minuteMatch) with the blockStart result
                      return h === hour && blockStart === minuteMatch && cls.day === day.id;
                      }) ?? null;


                let classHeight = match ? match.height : 'h-20';
                const isHighLighted = match && searchStudent == match.student_id ? 1 : 0;

                // If we have a match, we activate matchActive
                // So that in the next cycle nothing is rendered
                // and we get the matchEnds from the class.
                if(match){
                   matchActive = 1;
                  matchEnds	= match.ends
                }else{
                  //In case we don't have a match
                  // we validate if in the current cycle we are
                  // rendering a class (matchActive)
                  // and we also validate if we are at minute 0
                  // for example 9:00, 10:00, 11:00...
                  // print will define if an empty class is rendered.
                  print = matchActive == 0 && minute == 0 ? 1 : 0;
                }

                // DEFINING CLASS-ENDS
                // We are going to render an empty class in the next cycle
                // for example if the class ended at 9:30
                // we will print an empty class at 9:40.
                if(matchActive){
                  const classEnds = matchEnds == hour +'.'+ minute ? 1 : 0

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
                         if(minute <= 10){ classHeight = 'h-16' }
                      else if(minute <= 20){ classHeight = 'h-15' }
                      else if(minute <= 30){ classHeight = 'h-10' }
                      else if(minute <= 40){ classHeight = 'h-7' }
                      else if(minute <= 50){ classHeight = 'h-5' } 											
                    }
                  
                  //If we reach the column limit, reset 
                  // print and matchActive values
                  }else if(hour +'.'+ minute == '11.50'){
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
                  const nextClass = clases.filter(cls => cls.hour.split('.')[0] == hour
                                  && cls.day === day.id);

                  if(nextClass[0]){
                    //Obtaining the minute in which the next class starts
                    const startMinute = nextClass[0].hour.split('.')[1];

                    //Defining the height that the empty class box will have
                    // taking as reference the minute in which the class starts.
                       if(startMinute <= 10){ classHeight = 'h-4' }
                    else if(startMinute <= 20){ classHeight = 'h-7' }
                    else if(startMinute <= 30){ classHeight = 'h-10' }
                    else if(startMinute <= 40){ classHeight = 'h-16' }
                    else if(startMinute <= 50){ classHeight = 'h-18' }
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
