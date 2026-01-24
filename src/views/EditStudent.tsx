import { Navigate, useParams } from "react-router";
import StudentForm from "./StudentForm"
import { students } from "../data/students";



export default function EditStudent() {

  //Access to the id included on the URL with useParams()
  const { id } = useParams();
  const student = students.find(student => student.id === Number(id));


  if(!student){
    //replace avoids going back to the previous page with the browser back button
    //and tells React Router to replace the current entry in the browser history 
    //instead of adding a new one.
    return <Navigate 
              to="/students"
              replace
              state={{ error: "Student not found" }}
            />;
  }

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
