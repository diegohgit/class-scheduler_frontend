import axiosClient from "../config/axios";
import StudentForm from "./StudentForm";
import { CreateStudentDTO, Student } from "../types/Student";

export default function CreateStudent() {

  type Result = {
    success: boolean;
    message: string;
  };

  async function handleSubmitCreateStudent(data: Student): Promise<Result>{

    try {
      await axiosClient.post('/api/students', data as CreateStudentDTO);
      return {success: true, message: "Student created."};

    } catch (error: any){
      if(error.response?.status === 422){
        return { success: false, message: error.response.data.message };

      }else return { success: false, message: "An error has occurred" };
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
