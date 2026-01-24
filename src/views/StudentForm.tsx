import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router"
import { students } from "../data/students";


type Student = {
  name:      string;
  age:       number;
  level:     number;
  color:     number;
  homework?: string;
  progress?: string;
}


type Props = {
  initialValues?: Student | undefined;
  mode: "create" | "edit";
  onSubmit: (data: Student) => void;
}


export default function StudentForm({ initialValues, mode, onSubmit }: Props) {

  const {
    register,
    handleSubmit,
    reset
  } = useForm<Student>({
    defaultValues: { 
      name:     "",
      age:      0,
      level:    1,
      homework: "",
      color:    1,
      progress: "",
    }
  })

  useEffect(() => {
    if(initialValues){
      reset(initialValues);
    }
  }, [initialValues, reset]);


  const colors = [
    {id: "red",     value:"red",     class: "bg-red-400",     ring: "peer-checked:ring-red-400"},
    {id: "amber",   value:"amber",   class: "bg-amber-500",   ring: "peer-checked:ring-amber-500"},
    {id: "yellow",  value:"yellow",  class: "bg-yellow-300",  ring: "peer-checked:ring-yellow-300"},
    {id: "lime",    value:"lime",    class: "bg-lime-300",    ring: "peer-checked:ring-lime-300"},
    {id: "teal",    value:"teal",    class: "bg-teal-300",    ring: "peer-checked:ring-teal-300"},
    {id: "cyan",    value:"cyan",    class: "bg-cyan-300",    ring: "peer-checked:ring-cyan-300"},
    {id: "blue",    value:"blue",    class: "bg-blue-500",    ring: "peer-checked:ring-blue-500"},
    {id: "indigo",  value:"indigo",  class: "bg-indigo-300",  ring: "peer-checked:ring-indigo-300"},
    {id: "fuchsia", value:"fuchsia", class: "bg-fuchsia-300", ring: "peer-checked:ring-fuchsia-300"},
  ]


  return (
  <>
    <div className="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1"
        stroke="currentColor"
        className="size-40">
        <path 
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    </div>

    <div className="flex items-center justify-center">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-8/12">
        <div className=" mb-4">
          <p className="font-bold mb-1">Name:</p>
          <input 
            {...register("name")}
            className="input-base"
            placeholder="Student's name"
             />
        </div>
        <div className="flex">
          <div className="w-6/12 mb-4 mr-3">
            <p className="font-bold mb-1">Age:</p>
            <input 
              {...register("age")}
              className="input-base"
              placeholder="Student's age"
            />
          </div>
          <div className="w-6/12 mb-4">
            <p className="font-bold mb-1">English level:</p>
            <select 
              {...register("level")}
              className="input-base">
              <option value="1">A1</option>
              <option value="2">A2</option>
              <option value="3">B1</option>
              <option value="4">B2</option>
              <option value="5">C1</option>
              <option value="6">C2</option>
            </select>
          </div>
        </div>

        <p className="font-bold">Homework:</p>
        <textarea 
          {...register("homework")}
          className="textarea-base"
          name="homework"
          id="homework">
        </textarea>


        <p className="font-bold mb-1">Schedule Color:</p>
        <div className="flex gap-3 mb-4">
          {colors.map((color)=>(
            <label
              key={color.id}
              htmlFor={color.id} 
              className="cursor-pointer">
              <input 
                {...register("color")}
                className="peer" 
                hidden
                type="radio"
                name="color"
                id={color.id} />
              <span className={`${color.class} block w-10 
                              h-10 rounded-full transition
                              duration-300 peer-checked:ring-2 peer-checked:ring-offset-2
                              ${color.ring} `}></span>
            </label>
            ))
          }
        </div >

        
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

        <p className="font-bold mb-1">General Progress:</p>
        <textarea 
          {...register("progress")}
          className="textarea-base" 
          name="progress" 
          id="progress"></textarea>
      </form>
    </div>
  </>
  )
}
