import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSchool from "../hooks/useSchool";
import { useStudents } from "../hooks/useStudents";


export default function StudentList() {

  const navigate = useNavigate();
  const { filterStudents } = useSchool();
  //State to manage the searches
  const [ filter, setFilter ] =useState([]);


  //Get students using useStudents()
  const { data:records = [],
          isLoading,
          isSuccess,
        } = useStudents();

  useEffect(() => {
    if(isSuccess) setFilter(records)
  }, [isSuccess]);


  const handleSearch = (inpValue) => {

    //If user erases all letters, show full list again.
    if(!inpValue.length) setFilter(records);
    else setFilter(filterStudents(records, inpValue));
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
    <h1 className="title-base">Students</h1>

    <div className="w-6/12 h-90 mx-auto my-3">
      <div className="relative w-64 mx-auto">
        <input
          type="text"
          className="input-base my-2 text-sm"
          placeholder="Search for student..."
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
      <DataTable 
        progressPending = {isLoading}
        progressComponent = {<p>Loading Students...</p>}
        columns = {columns}
        data    = {filter}
        pagination
        paginationPerPage = {10}
        onRowClicked      = {(row, e) => {
          navigate(`/students/${row.id}`)
        }}
      />

      <div className="bottom-bar">
        <button className="button-base flex items-center 
                           justify-center bg-indigo-500 hover:bg-indigo-600"
                onClick={() => navigate('/students/create_student')}
        >
        {/* "Plus" icon  */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

        <span>Add student</span>
        </button>
      </div>
    </div>
  </>
  )
}
