import { useNavigate, useParams } from "react-router";
import StudentForm from "./StudentForm"
import useSchool from "../hooks/useSchool";
import { useEffect, useState } from "react";
import { Student } from "../types/Student";



export default function EditStudent() {

  //Access to the id included on the URL with useParams()
  const { id } = useParams();
  const { getStudents } = useSchool();

  const [ student, setStudent ] = useState<Student | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      //Run getStudents with the student id
      //When the response is received, store it in the state
      const response = await getStudents(id);
      setStudent(response)

      //If theres no response
      //redirect to the student list and show an error msg
      if(!response){
        navigate("/students", {
          replace: true,
          state: { error: "Student not found"}
          });
        return
      }
    };

    fetchStudent();
  }, []);

  return (
    <>
      <StudentForm 
        mode = "edit"
        initialValues = {student}
        onSubmit={(data) => {
          console.log("Edited student data:", data);
        }}
      />
    </>
  )
}
