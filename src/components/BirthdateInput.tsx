import { useEffect, useState } from "react";
import useSchool from "../hooks/useSchool";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";



type Props = {
  initialBirthdate?: Date | string | null;
  onChange?: (date: Date | string) => void;
  mode?: string;
}



export default function BirthdateInput({initialBirthdate, mode, onChange}: Props) {

  const { validDate, setValidDate } = useSchool();



  //Format the birthdate typed by the user
  const formatBirthdate = (value: string) => {
    //set validDate to false every time the user starts to 
    //type a new date.
    setValidDate(false);

    //Get only numbers and limit to 8 digits
    const digits = value?.replace(/\D/g, "")?.slice(0, 8);

    //Fragment date string to get day, month and year
    const month = digits.slice(0, 2);
    const day   = digits.slice(2, 4);
    const year  = digits.slice(4, 8);

    //Concatenating a "/" every two digits 
    // to get the date format
    if(digits.length <= 2) return month;
    if(digits.length <= 4) return `${month}/${day}`;
    return `${month}/${day}/${year}`;
  }



  //Include typed date in the form values
  const handleBirthDate = (value: string) => {
    onChange?.(formatBirthdate(value))
  }



  //Validate birthdate typed by the user
  const [age, setAge]               = useState<number>(0);
  const [markInput, setMarkInput]   = useState<boolean>(false)
  const [ageMessage, setAgeMessage] = useState<String>("");

  dayjs.extend(customParseFormat);

  const handleDateValidation = (date:string) => {
    //Using dayjs to work with dates
    const parsedDate = dayjs(date, "MM/DD/YYYY", true);
    const valid = parsedDate.isValid();
    setValidDate(false);

    if(date !== ""){

      if(!valid){
        setAgeMessage('Invalid date')
        setMarkInput(true)
        return;

      }else{
        //Validate that birthdate is more than 
        //2 years ago and less than 100 years ago.
        const twoYearsAgo = dayjs().subtract(2, "year");
        const aHundredYearsAgo = dayjs().subtract(100, "year");

        if(parsedDate.isAfter(twoYearsAgo) || parsedDate.isBefore(aHundredYearsAgo)){
          setAgeMessage("Invalid year");
          setMarkInput(true);
          return;

        }else{
          //If birthdate is valid
          //calculate age and store it in the state.
          const age = dayjs().diff(parsedDate, "year");
          setAge(age);
          setValidDate(true);
        }
      }
    }else{setValidDate(true);}
    setMarkInput(false);
  };



  //Calculate age in "edit" mode.
  useEffect(() => {

    //initialValues are fetched asynchronously,
    //if they aren't loaded yet, return and check again
    if (!initialBirthdate || mode !== "edit") return;

    //Validate initialValues when its loaded
    if(initialBirthdate) handleDateValidation(String(initialBirthdate));

  }, [initialBirthdate, mode])



  return (
    <>
      <div className="w-full md:w-1/2 mb-6">
        <p className="font-bold mb-1">Birthdate (MM/DD/YYYY):</p>
        <div className="flex ">
          <div className="w-1/2">
            <input
              className={`input-base ${markInput === true ? "focus:border-0! border-red-500! border-2!":"" } `}
              placeholder="(optional)"
              type="text"
              value={String(initialBirthdate)}
              onChange={ (e) => {handleBirthDate(e.target.value);
                                 setAgeMessage("");
                                 setAge(0);}
                        }
              onBlur={(e) => (handleDateValidation(e.target.value))}
            />
            <p className={`${ageMessage !== "" ? '' : 'hidden' } text-md text-red-500` }>{`${ageMessage}`}</p>
          </div>

          { age > 0 && validDate &&  <p className ='m-2'>({age} years old)</p> }
        </div>
      </div>
    </>
  )
}