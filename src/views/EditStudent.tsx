import { useNavigate, useParams } from "react-router";
import StudentForm from "./StudentForm"
import { useEffect } from "react";
import { useStudent, useStudentMutation } from "../hooks/useStudents";
import { toast } from "react-toastify";
import axios from "axios";

export default function EditStudent() {

  const { id }   = useParams();
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



  const studentMutation = useStudentMutation({
    onSuccess: (success: boolean) => {
      if(success) navigate("/students");
    }
  });



  return (
    <>
      <StudentForm 
        mode = "edit"
        initialValues = {student}
        onSubmit={(student, method) => studentMutation.mutateAsync({
                                data: student,
                                method
                              })
                  }
        isPending = {studentMutation.isPending}
      />
    </>
  )
}
