import axiosClient from "../config/axios";
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
      //Run getStudents with the student id.
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

  async function handleSubmitEditStudent(data: Student):Promise<boolean>{
    try {
      await axiosClient.put('api/students/'+id, data);
      console.log("Student edited");
      return true;
    } catch (error) {
      console.log("An error has ocurred.");
      console.log(error);
      return false;
    }
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
