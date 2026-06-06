import StudentForm from "./StudentForm";
import { useNavigate } from "react-router";
import { useStudentMutation } from "../hooks/useStudents";

export default function CreateStudent() {


  const navigate = useNavigate();

  const studentMutation = useStudentMutation({
    onSuccess: (success: boolean) => {
      if(success)navigate("/students");
    }
  })



  return (
    <>
      <StudentForm
        mode = "create"
        onSubmit={(student) => studentMutation.mutateAsync({
                                data: student,
                                method: "POST"
                              })
                  }
      />
    </>
  )
}
