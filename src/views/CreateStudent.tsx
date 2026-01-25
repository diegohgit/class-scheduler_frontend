import StudentForm from "./StudentForm";


export default function CreateStudent() {
  return (
    <>
      <StudentForm 
        mode = "create"
        onSubmit={(data) => {
          console.log("Created student data:", data);
        }}
      />
    </>
  )
}
