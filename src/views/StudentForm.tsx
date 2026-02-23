import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useSchool from "../hooks/useSchool";
import { Student } from "../types/Student";


type Props = {
  initialValues?: Student | undefined;
  mode: "create" | "edit";
  onSubmit: (data: Student) => void;
}


export default function StudentForm({ initialValues, mode, onSubmit }: Props) {

  //give a default color if creating a new student
  const defaultColor = Math.floor(Math.random() * 9) + 1;

  const {
    register,
    watch,
    handleSubmit,
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


  const colors = [
    {id: 1, value:"red",     class: "bg-red-400",     ring: "peer-checked:ring-red-400"},
    {id: 2, value:"amber",   class: "bg-amber-500",   ring: "peer-checked:ring-amber-500"},
    {id: 3, value:"yellow",  class: "bg-yellow-300",  ring: "peer-checked:ring-yellow-300"},
    {id: 4, value:"lime",    class: "bg-lime-300",    ring: "peer-checked:ring-lime-300"},
    {id: 5, value:"teal",    class: "bg-teal-300",    ring: "peer-checked:ring-teal-300"},
    {id: 6, value:"cyan",    class: "bg-cyan-300",    ring: "peer-checked:ring-cyan-300"},
    {id: 7, value:"blue",    class: "bg-blue-500",    ring: "peer-checked:ring-blue-500"},
    {id: 8, value:"indigo",  class: "bg-indigo-300",  ring: "peer-checked:ring-indigo-300"},
    {id: 9, value:"fuchsia", class: "bg-fuchsia-300", ring: "peer-checked:ring-fuchsia-300"},
  ]

  const { useChangesProtection } = useSchool();

  const navigate = useNavigate();

  const watchName = watch("name");

  const [isDirty, setIsDirty] =  useState(false);
  useChangesProtection(isDirty);

  const { id } = useParams();

  return (
  <>
    <h1 className="text-center font-bold text-4xl">
      {mode === "create" ? "New Student" : watchName}
    </h1>

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
            onChange={() => setIsDirty(true)}
             />
        </div>

        <div className="flex">
          <div className="w-6/12 mb-4 mr-3">
            <p className="font-bold mb-1">Age:</p>
            <input 
              {...register("birthdate")}
              className="input-base"
              placeholder="Student's birthdate"
              onChange={() => setIsDirty(true)}
            />
          </div>

          <div className="w-6/12 mb-4">
            <p className="font-bold mb-1">English level:</p>
            <select 
              {...register("level")}
              className="input-base"
              onChange={() => setIsDirty(true)}
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
            {...register("homework")}
            className="textarea-base"
            name="homework"
            id="homework"
            onChange={() => setIsDirty(true)}
            ></textarea>
        </div>

        <p className="font-bold mb-1">Schedule Color:</p>
        <div className="flex gap-3 mb-4">
          {colors.map((color)=>(
            <label
              key={color.id}
              htmlFor={color.id.toString()} 
              className="cursor-pointer">
              <input 
                {...register("color")}
                id={color.id.toString()} 
                className="peer" 
                hidden
                type="radio"
                name="color"
                value={color.id.toString()}
                onChange={() => setIsDirty(true)} />
              <span className={`${color.class} block w-10 
                              h-10 rounded-full transition
                              duration-300 peer-checked:ring-2 peer-checked:ring-offset-2
                              ${color.ring} `}></span>
            </label>
            ))
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
            {...register("progress")}
            className="textarea-base" 
            name="progress" 
            id="progress"
            onChange={() => setIsDirty(true)}
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
