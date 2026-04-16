import axiosClient from "../config/axios";
import { useNavigate, useParams } from "react-router";
import StudentForm from "./StudentForm"
import useSchool from "../hooks/useSchool";
import { useEffect, useState } from "react";
import { UpdateStudentDTO, Student } from "../types/Student";
import { useApi } from "../hooks/useApi";

export default function EditStudent() {

  //Access to the id included on the URL with useParams()
  const { id } = useParams();
  const { getStudents } = useSchool();

  const [ student, setStudent ] = useState<Student | undefined>(undefined);
  const navigate = useNavigate();

  //Fetch student when the component is mounted.
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
