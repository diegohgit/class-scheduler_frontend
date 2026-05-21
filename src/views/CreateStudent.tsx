import StudentForm from "./StudentForm";
import { CreateStudentDTO, Student } from "../types/Student";
import { useApi } from "../hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useSchool from "../hooks/useSchool";
import { useNavigate } from "react-router";

export default function CreateStudent() {

  const { shouldNavigate, setShouldNavigate } = useSchool();
  const navigate = useNavigate();

  const { request } = useApi();
  //Send request to create a student.
  async function handleSubmitCreateStudent(data: Student): Promise<boolean>{

    const { success } = await request("POST", 
                                      "api/students/", 
                                      data as CreateStudentDTO,
                                      "Student created." );
    return success;
  }



  const queryClient = useQueryClient();

  const studentMutation = useMutation({
    mutationFn: handleSubmitCreateStudent,
    onSuccess:async (success: boolean) => {
      if(success){
        await queryClient.refetchQueries({queryKey:["students"]});
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
        mode = "create"
        onSubmit={studentMutation.mutateAsync}
      />
    </>
  )
}
