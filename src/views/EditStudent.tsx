import { useNavigate, useParams } from "react-router";
import StudentForm from "./StudentForm"
import useSchool from "../hooks/useSchool";
import { useEffect } from "react";
import { UpdateStudentDTO, Student } from "../types/Student";
import { useApi } from "../hooks/useApi";
import { useStudent } from "../hooks/useStudents";
import { toast } from "react-toastify";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

export default function EditStudent() {

  const { id } = useParams();
  const { shouldNavigate, setShouldNavigate } = useSchool();
  const navigate = useNavigate();
  const { data: student,
          isError,
          error
        } = useStudent(id);


  //Redirect if user tries to get a student who doesn't exist.
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



  const queryClient = useQueryClient();

  const updateStudentMutation = useMutation({
    mutationFn: handleSubmitEditStudent,
    onSuccess: async (success: boolean) => {
      if(success){
        await queryClient.refetchQueries({queryKey:["students"]});
        await queryClient.refetchQueries({queryKey:["student", id]});
      }
    }
  });



  //Navigate after shouldNavigate flag is set to true
  //in StudentForm.tsx
  useEffect(() => {

    if(shouldNavigate){
      setShouldNavigate(false);
      navigate("/students");
    }
  }, [shouldNavigate, navigate,]);



  return (
    <>
      <StudentForm 
        mode = "edit"
        initialValues = {student}
        onSubmit={(data:Student) => updateStudentMutation.mutateAsync(data)}
      />
    </>
  )
}
