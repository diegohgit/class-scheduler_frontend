import axiosClient from "../config/axios";
import StudentForm from "./StudentForm";
import { CreateStudentDTO, Student } from "../types/Student";
import { useApi } from "../hooks/useApi";

export default function CreateStudent() {

  const { request } = useApi();
  //Send request to create a student.
  async function handleSubmitCreateStudent(data: Student): Promise<boolean>{

    const { success } = await request("POST", 
                                      "api/students/", 
                                      data as CreateStudentDTO,
                                      "Student created." );

    return success;
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
