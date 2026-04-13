import axiosClient from "../config/axios";
import { useNavigate, useParams } from "react-router";
import StudentForm from "./StudentForm"
import useSchool from "../hooks/useSchool";
import { useEffect, useState } from "react";
import { UpdateStudentDTO, Student } from "../types/Student";


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

  type Result = {
    success: boolean;
    message: string;
  };

  async function handleSubmitEditStudent(data: Student): Promise<Result>{

    try {
      await axiosClient.put('api/students/'+id, data as UpdateStudentDTO);
      return {success: true, message: "Student modified."};

    } catch (error: any){
      if(error.response?.status === 422){
        return { success: false, message: error.response.data.message };

      }else return { success: false, message: "An error has occurred" };
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
