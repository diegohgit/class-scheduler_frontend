import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useSchool from "../hooks/useSchool";

export default function StudentList() {

  const navigate = useNavigate();
  const location = useLocation();
  const { getStudents, loading } = useSchool();
  const [records, setRecords] = useState([]);
  //Create a state to manage the searches 
  const [ filter, setFilter ] =useState([]);
  
  useEffect(() => {
    const fetchStudents = async () => {
      const response = await getStudents();

      setRecords(response);
      setFilter(response)
    }
    
    fetchStudents();
  }, [])


  const handleChange = (e) => {
    const inpValue = e.target.value.toLowerCase();

    const filteredRecords = records.filter(student => {
      return  student.name.toLowerCase().includes(inpValue) ||
              student.level.toLowerCase().includes(inpValue);
    })

    //Modify "filter" state to not alter the original "students" state
    setFilter(filteredRecords)
  }

  //Columns for the DataTable component
  const columns = [
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Level",
      selector: row => row.level,
      sortable: true,
    },
  ]


  return (
  <>
    {location.state?.error && (
      <div className="w-6/12 mx-auto my-2 p-2
              bg-red-200 text-red-800 font-bold
              border border-red-800 rounded">
        {location.state.error}
      </div>
    )}

    <h1 className="title-base">Students</h1>

    <div className="w-6/12 h-90 mx-auto my-3">
      <div className="relative w-64 mx-auto">
        <input
          type="text"
          className="input-base my-2 text-sm"
          placeholder="Search for student..."
          onChange={handleChange}
        />

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
      <DataTable 
        progressPending = {loading}
        progressComponent = {<p>Loading Students...</p>}
        columns = {columns}
        data    = {filter}
        pagination
        paginationPerPage = {10}
        onRowClicked      = {(row, e) => {
          navigate(`/students/${row.id}`)
        }}
      />

      <div className="flex justify-center">
        <button className="w-40 h-8 my-4 rounded 
                  bg-blue-500 text-white font-bold
                  hover:cursor-pointer hover:bg-blue-600"
                onClick={() => navigate('/students/create_student')}
                  >
          Add Student
        </button>
      </div>
    </div>
  </>
  )
}
