import axiosClient from "../config/axios";
import StudentForm from "./StudentForm";
import { CreateStudentDTO, Student } from "../types/Student";

export default function CreateStudent() {

  async function handleSubmitCreateStudent(data: Student){
    try {
      await axiosClient.post('/api/students', data as CreateStudentDTO);
      console.log("Student created");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <StudentForm 
        mode = "create"
        onSubmit={handleSubmitCreateStudent}
      />
    </>
  )
}
