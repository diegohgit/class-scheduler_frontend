import axiosClient from "../config/axios";
import { useNavigate, useParams } from "react-router";
import StudentForm from "./StudentForm"
import useSchool from "../hooks/useSchool";
import { useEffect, useState } from "react";
import { UpdateStudentDTO, Student } from "../types/Student";
import { useApi } from "../hooks/useApi";
import { useStudent } from "../hooks/useStudents";
import { toast } from "react-toastify";
import axios from "axios";

export default function EditStudent() {

  //Access to the id included on the URL with useParams()
  const { id } = useParams();
  
  const { data: student,
          isError,
          error
        } = useStudent(id);


  const navigate = useNavigate();

  //Redirect if user tries to get an student who doesn't exist.
  useEffect(() => {

      if(isError
         && axios.isAxiosError(error)
         && error.response?.status === 404
        ){
          toast.error("Student not found");

          navigate("/students", {
            //replace: true is used to prevent saving 
            //this invalid entry in the browser history.
            replace: true,
          });
      }
  }, [isError, error, navigate]);


  const { request } = useApi();
  //Send request to modify a student.
  async function handleSubmitEditStudent(data: Student): Promise<boolean>{

    const { success } = await request("PUT", 
                                      "api/students/"+id,
                                      data as UpdateStudentDTO,
                                      "Student modified.");

    return success;
  }


  return (
    <>
      <StudentForm 
        mode = "edit"
        initialValues = {student}
        onSubmit={(data:Student) => handleSubmitEditStudent(data)}
      />
    </>
  )
}
