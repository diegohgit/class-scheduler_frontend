import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useSchool from "../hooks/useSchool";
import { Student } from "../types/Student";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

type Props = {
  initialValues?: Student | undefined;
  mode: "create" | "edit";
  //onSubmit is a function that receives a Student object 
  //and returns a Promise that resolves to nothing.
  //its a promise because our parent function is async
  onSubmit: (data: Student) => Promise<void>;
}


export default function StudentForm({ initialValues, mode, onSubmit }: Props) {

  //give a default color if creating a new student
  const defaultColor = Math.floor(Math.random() * 9) + 1;

  const {
    //Tools provided by useForm
    register,
    setValue,
    watch,
    reset
  } = useForm<Student>({
    defaultValues: {
      name:      "",
      birthdate: null,
      level:     1,
      homework:  null,
      //Parse color to string because in the radio inputs this 
      //field must be a string so the selection can be shown
      color:     defaultColor.toString(),
      progress:  null
    }
  })

  useEffect(() => {
    if(initialValues){
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const { useChangesProtection, getResources, loading } = useSchool();
  const [ colors, setColors ] = useState<Array<{id: number, name: string}>>([]);

  //Fetch colors.
  useEffect(() => {
    const fetchColors = async () =>{
      const response = await getResources('api/colors/');
      setColors(response);
    }
    fetchColors();
  }, []);

  const watchName = watch("name");

  const [isDirty, setIsDirty] =  useState<Boolean>(false);
  //Why was I calling this function from here?
  //useChangesProtection(isDirty);

  //get the id that comes in the url
  const { id } = useParams();

  const [age, setAge]                     = useState<number>(0);
  const [tempBirthdate, setTempBirthdate] = useState<string>("");

  const formatBirthdate = (value:string) => {
    //Get only numbers and limit to 8 digits
    const digits = value.replace(/\D/g, "").slice(0, 8);

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

  const handleBirthDate = (value:string) => {
    //Include the date in the form values
    setTempBirthdate(formatBirthdate(value));
  }

  const [markInput, setMarkInput] = useState<boolean>(false)
  const [validDate, setValidDate] = useState<boolean>(false)
  const [birthdate, setBirthdate] = useState<Date>('' as unknown as Date);

  dayjs.extend(customParseFormat);

  const handleDateValidation = (date:string) => {
    //Using dayjs to work with dates
    const parsedDate = dayjs(date, "MM/DD/YYYY", true);
    const valid = parsedDate.isValid();
    
    if(date != ""){
      if(!valid){
        toast.error('Invalid date')
        setMarkInput(true)
        return;
      }else{
        //Validate that the birthdate is more than 
        //2 years ago and less than 100 years ago.xz
        const twoYearsAgo = dayjs().subtract(2, "year");
        const aHundredYearsAgo = dayjs().subtract(100, "year");

        if(parsedDate.isAfter(twoYearsAgo) || parsedDate.isBefore(aHundredYearsAgo)){
          toast.error("You must try another year");
          setMarkInput(true);
          return;
        }else{
          //If the birthdate is valid
          //calculate age and store it in the state
          const age = dayjs().diff(parsedDate, "year");
          setAge(age);
          setBirthdate(parsedDate.toDate());
          setValidDate(true);
        }
      }
    }
    setMarkInput(false);
  };

  //Calculate age when the mode is "edit"
  useEffect(() => {

    //If there are no initial values yet, or we aren't in edit mode, return
    //This is helpful because the initialValues are fetched asynchronously, 
    // so at the beginning they are undefined but eventually they will be loaded
    if (!initialValues || mode !== "edit") return;

    //When initialValues are loaded, check if there is birthdate
    //so we can calculate the age and show it in the form.
    if(initialValues.birthdate){
      const parsedDate = dayjs(initialValues.birthdate, "MM/DD/YYYY", true);
      const age = dayjs().diff(parsedDate, "year");
      setAge(age);

      //Set the birthdate when initialValues is loaded so the user 
      // can see a value in the birthdate input when the user is in edit mode.
      setTempBirthdate(initialValues.birthdate.toString());
    }
  }, [initialValues, mode])

  //Validate form data (name and birthdate in this case)
  const validation = (): boolean => {

    if(watchName === ""){
      toast.error("Name is required");
      return false;
    }

    if(!validDate){
      toast.error("You must enter a valid birthdate");
      return false;
    }else{
      //If date is valid overwrite 
      //add it to the form values.
      setValue("birthdate", birthdate);
      return true;
    }
  }

  const navigate = useNavigate();

  //Submit handler
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //Run validation function, if it returns true, run onSubmit function
    //and send to it the form values with watch()
    if(validation()){
      await onSubmit(watch());

      //After onSubmit is finished
      //setIsDirty to false and redirect to the students list
      setIsDirty(false);
      navigate("/students");
    }
  }


  return (
  <>
    <h1 className="text-center font-bold text-4xl">
      {mode === "create" ? "New Student" : watchName}
    </h1>

    <div className="flex items-center justify-center">
      <form 
        onSubmit={handleSubmit}
        className="w-8/12">

        <div className=" mb-4">
          <p className="font-bold mb-1">Name:</p>
          <input 
            {...register("name",{
              onChange:() => setIsDirty(true)
            })}
            className="input-base"
            placeholder="Student's name"
          />
        </div>

        <div className="flex">
          <div className="w-6/12 mb-4 mr-3">
            <p className="font-bold mb-1">Birthdate (MM/DD/YYYY):</p>
            <div className="flex">
              <input
                {...register("birthdate",{
                    onChange: (e) => {
                            setIsDirty(true);
                            handleBirthDate(e.target.value);
                    },
                    onBlur: (e) => handleDateValidation(e.target.value),
                  }
                )}
                className={`input-base w-3/6! ${markInput === true ? "focus:border-0! border-red-500! border-2!":"" } `}
                placeholder="(optional)"
                type="text"
                value={tempBirthdate}
              />
              <p className={`${age > 0 ? 'ml-4' : 'hidden' }`}>({`${age}`} years old)</p>              
            </div>
          </div>

          <div className="w-6/12 mb-4">
            <p className="font-bold mb-1">English level:</p>
            <select 
              {...register("level", {
                onChange:() => setIsDirty(true)    
              })}
              className="input-base"
            >
              <option value="1">A1</option>
              <option value="2">A2</option>
              <option value="3">B1</option>
              <option value="4">B2</option>
              <option value="5">C1</option>
              <option value="6">C2</option>
            </select>
          </div>
        </div>

        <div className={`${mode === "create" ? "hidden" : ""}`}>
          <p className="font-bold">Homework:</p>
          <textarea 
            {...register("homework",{
              onChange:() => setIsDirty(true)
            })}
            className="textarea-base"
            name="homework"
            id="homework"
          ></textarea>
        </div>

        <p className="font-bold mb-1">Schedule Color:</p>
        <div className="flex gap-3 mb-4">
          <p className={`${loading ? "" : "hidden"}`}>Loading colors...</p>
          {colors.map((color)=>{
              return <label
                      key={color.id}
                      htmlFor={color.id.toString()}
                      className="cursor-pointer">
                        <input
                          {...register("color",{
                            onChange:() => setIsDirty(true)
                          })}
                          id={color.id.toString()}
                          className="peer"
                          hidden
                          type="radio"
                          name="color"
                          value={color.id.toString()}
                        />
                        <span className="block w-10 h-10
                                        rounded-full transition duration-300 
                                        peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-gray-300"
                              style = {{backgroundColor: color.name}}
                                    ></span>
                    </label>
            })
          }
        </div >

        <div className={mode === "edit" ? "block" : "hidden"}>
          <p className="font-bold mb-1">Student's classes:</p>
          <div className="flex mb-4">
            <div className="w-30 h-20 bg-gray-100 pt-1 mr-2 
                    text-center rounded hover:cursor-pointer hover:bg-blue-200">
              <p className="text-center font-bold text-transform: uppercase
                mt-4">
                TUE
              </p>
              <p>10:00</p>
            </div>
            <div className="w-30 h-20 bg-gray-100 pt-1 mr-2
                    text-center rounded hover:cursor-pointer hover:bg-blue-200">
              <p className="text-center font-bold text-transform:uppercase
                mt-4">
                THU
              </p>
              <p>11:00</p>
            </div>
            <div className="w-30 h-20 bg-gray-100 pt-1 mr-2
                            text-center rounded hover:cursor-pointer 
                          hover:bg-blue-200">
              <p className="text-center font-bold text-transform:uppercase
                mt-4">
                FRI
              </p>
              <p>11:00</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex">
            <p className="w-8/12 font-bold mb-1 ">General Progress:</p>
            <button 
              type="button"
              onClick={() => {
                navigate(`/students/${id}/progress`);
              }}
              className={`${mode === "edit" ? "block" : "hidden"}
                         button-base mx-auto bg-blue-500 hover:bg-blue-600`}>
              See progress
            </button>
          </div>
          <textarea 
            {...register("progress", {
              onChange:() => setIsDirty(true)
            })}
            className="textarea-base" 
            name="progress" 
            id="progress"
            placeholder="Write something about this student level (optional)"
          ></textarea>     
        </div>

        <div className="items-center justify-center flex mt-4">
          <button 
            type="button"
            className="button-base mx-auto bg-amber-300 hover:bg-amber-400"
            onClick={() => {
              navigate("/students");
            }}>
            Back to list
          </button>

          <button 
            type="submit"
            className="button-base mx-auto bg-green-500 hover:bg-green-600">
            {mode === "create" ? "Create Student" : "Save Changes"}
          </button>

          <button 
            type="button"
            className={`${mode === "edit" ? "block" : "hidden"}
                       button-base mx-auto bg-red-500 hover:bg-red-600`}>
            Delete Student
          </button>
        </div>
      </form>
    </div>
  </>
  )
}
