import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import useSchool from "../hooks/useSchool";
import { Student } from "../types/Student";
import { toast } from "react-toastify";
import { useApi } from "../hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import BirthdateInput from "../components/BirthdateInput";
import LoadingMessage from "../components/LoadingMessage";

type Props = {
  initialValues?: Student | undefined;
  mode : "create" | "edit";
  //onSubmit is a function that receives a Student object 
  //and returns a Promise that resolves to nothing.
  //its a promise because our parent function is async
  onSubmit  : (data: Student | any, method: String) => Promise<any>;
  isPending : boolean
}


export default function StudentForm({ initialValues, mode, onSubmit, isPending }: Props) {

  const { id } = useParams();
  const navigate = useNavigate();
  const [ confirmDelete, setConfirmDelete ] = useState(false);



  //Give a default color if user is creating a new student.
  const defaultColor = Math.floor(Math.random() * 9) + 1;

  const {
    //Tools provided by useForm
    register,
    watch,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<Student>({
    defaultValues: {
      first_name  : "",
      last_name   : "",
      phone       : "",
      email       : "",
      birthdate   : "",
      level_id    : "1",
      class_notes : null,
      //Parse color to string because in the radio inputs this 
      //field must be a string so the selection can be shown
      color_id : defaultColor.toString(),
      progress : null
    }
  })



  //Load initialValues into form inputs. 
  useEffect(() =>{
    if(!initialValues) return;

    //This values must be converted to String so they can be
    //read by their inputs.
    const initVal = {...initialValues,
                      color_id: String(initialValues.color.id), 
                      level_id: String(initialValues.level.id) }

    //Load initialValues into form inputs. 
    reset(initVal);
  }, [initialValues, reset]);



  const { useChangesProtection, setShouldNavigate, validDate,
          getFormattedDate } = useSchool();

  //Handle form changes
  useChangesProtection(isDirty);



  //Fetch list of colors.
  const { request } = useApi();

  const fetchColors = async () => {
    const { success, response } = await request("GET", "api/colors/",);

    if(!success) throw new Error("Failed to fetch colors.");
    return response?.data;
  }

  const { data:colors = [],
          isLoading,
          isError,
        } = useQuery({
          queryKey  : ["colors"],
          queryFn   : fetchColors,
          staleTime : Infinity,
          gcTime    : 1000 * 60 * 90,//1hr 30min
          retry     : false,
        });



  //Validate form data (name and birthdate in this case).
  const validation = (): boolean => {

    if(watch("first_name") === ""){
      toast.error("First name is required");
      return false;
    }

    //Regex to validate that the e-mail contains an identifier, 
    //an @ symbol, a domain name, a dot (.), 
    //and a domain extension, with no spaces anywhere.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const watchEmail = watch('email') ?? '';

    if(watchEmail && !emailRegex.test(watchEmail)){
      toast.error("The email field must be a valid email address.");
      return false;
    }

    //Validate birthdate.
    const birthdateValidation = watch("birthdate") ?? '';

    if(!validDate && birthdateValidation !== ''){
      toast.error("You must enter a valid birthdate");
      return false;
    }

    return true;
  }



  //State useful to define wich action is being requested.
  const [ loadingAction , setLoadingAction ] = useState("");



  //Submit handler
  const submit = async (data:Student | null, method: string) => {

    if(!validation() && method !== "DELETE") return;

    //const success = await onSubmit(normalizeToBackend(data), method);
    const success = await onSubmit(data, method);

    if(success){
      //reset() will switch isDirty to "false" so we can navigate().
      //navigate() can't be used here because isDirty isn't updated yet.
      reset();
      setShouldNavigate(true);
    }
  }



  //Styles
  const rowContainer = 'flex flex-col md:flex-row gap-4 mb-4';
  const fieldContainder = 'w-full md:w-1/2 mb-6';



  {/**
    *
    *     FORM
    * 
    */}
  return (
  <>

    <h1 className="title-base">
      {mode === "create" ? "New Student" : watch("first_name")}
    </h1>

    {initialValues || mode === "create" ? (
      <>
        {/* Loading request message */}
        {isPending && <LoadingMessage text={loadingAction} />}

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit((data) => submit(data, mode === "create" ? "POST":"PUT"))}
            className="w-full max-w-3xl px-4"
          >
            <div className={rowContainer}>
              <div className={fieldContainder}>
                <p className="font-bold mb-1">First name:</p>
                <input
                  {...register("first_name")}
                  className="input-base md:w-10/12!"
                  placeholder="Student's first name"
                />
              </div>
              <div className={fieldContainder}>
                <p className="font-bold mb-1">Last name:</p>
                <input
                  {...register("last_name")}
                  className="input-base md:w-10/12!"
                  placeholder="(Optional)"
                />
              </div>
            </div>

            <div className={rowContainer}>
              <div className={fieldContainder}>
                <p className="font-bold mb-1">Phone:</p>
                <input
                  {...register("phone")}
                  className="input-base w-full md:w-10/12"
                  placeholder="Phone number (optional)"
                />
              </div>
              <div className={fieldContainder}>
                <p className="font-bold mb-1">E-mail:</p>
                <input
                  {...register("email")}
                  className="input-base w-full md:w-10/12"
                  placeholder="(Optional)"
                />
              </div>
            </div>

            <div className={rowContainer}>

            {/* Birthdate input 
                Handle it with Controller so we can use isDirty 
                with an external input.
            */}
              <Controller
                //Shouldn´t use register() because Controller 
                //needs name="" to use its own features
                name="birthdate"
                control={control}
                render={({field}) =>(
                    <BirthdateInput
                      initialBirthdate = {field.value ?? '' }
                      mode = {mode}
                      onChange={field.onChange}
                    />)}
              />

              <div className={fieldContainder}>
                <p className="font-bold mb-1">English level:</p>
                <select 
                  {...register("level_id")}
                  className="input-base w-full md:w-10/12"
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

              <div className="flex">
                <span className="font-bold">Class notes:</span>

                {initialValues?.class_notes_date && 
                  <div>
                    <span className="italic ml-4">(Last entry: </span>
                    <span className="italic">{ getFormattedDate(initialValues?.class_notes_date)} )</span>
                  </div>
                }
              </div>

              <textarea 
                {...register("class_notes")}
                className="textarea-base resize-none"
                name="class_notes"
                id="class_notes"
              ></textarea>
            </div>


            { colors.length > 0 
              && (<p className="font-bold mb-1">Schedule Color:</p>)}

            { isError && (<p>Couldn't fetch colors.</p>) }

            <div className="flex gap-3 mb-4">
              { isLoading && (<p>Loading colors...</p>) }

              {colors.map((color:any)=>{
                  return <label
                          key={color.id}
                          htmlFor={color.id.toString()}
                          className="cursor-pointer">
                            <input
                              {...register("color_id")}
                              id={color.id.toString()}
                              className="peer"
                              hidden
                              type="radio"
                              name="color_id"
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

            <div className="mb-10">
              <div className="flex">
                <p className="w-8/12 font-bold mb-1 ">General Progress:</p>

                {mode === "edit" &&
                  <button type="button"
                          onClick={() => {
                            navigate(`/students/${id}/progress`);
                          }}
                          className="button-base mx-auto bg-blue-500 hover:bg-blue-600">
                    See progress
                </button>}
              </div>
              <textarea 
                {...register("progress")}
                className="textarea-base resize-none"
                name="progress" 
                id="progress"
                placeholder="Write something about this student's level (optional)."
              ></textarea>
            </div>



            <div className="bottom-bar">
              <button type="button"
                      className="button-base bg-blue-500 hover:bg-blue-600"
                      onClick={() => navigate("/students")}
              >
                Back to list
              </button>

              {isDirty &&
                <button type="submit"
                        className="button-base bg-green-500 hover:bg-green-600"
                        onClick={() => setLoadingAction(mode === "edit" 
                                                          ? "Saving changes..." 
                                                          : "Saving student...")}
                >
                  {mode === "create" ? "Create student" : "Save changes"}
                </button>
              }

              {mode === "edit" && (
                confirmDelete === false ? 
                (
                  <button type="button"
                          className="button-base bg-red-500 hover:bg-red-600"
                          onClick={() => setConfirmDelete(true)}
                  >
                    Delete student
                  </button>
                ) : (
                  <div className="flex items-center">
                    <span>Delete student?</span>
                    <div className="*:m-1 *:font-bold *:hover:underline
                                    *:hover:cursor-pointer"
                    >
                      <span onClick={() => setConfirmDelete(false)}
                      >No</span>

                      <span onClick={handleSubmit((data) => {submit(data, "DELETE")
                                                             setLoadingAction("Deleting student...")})}
                      >Yes</span>
                    </div>
                  </div>
                ))
              }

            </div>
          </form>
        </div>
      </>
      ):(
      <LoadingMessage text="Loading student..."/>
    )
    }

  </>
  )
}