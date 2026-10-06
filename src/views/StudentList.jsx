import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSchool from "../hooks/useSchool";
import { useStudents } from "../hooks/useStudents";
import axiosClient from "../config/axios";


export default function StudentList() {

  const navigate = useNavigate();
  const { filterStudents } = useSchool();
  //State to manage the searches
  const [ filter, setFilter ] = useState([]);



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
      name     : "Name",
      selector : row => {//Add a lastName format because if it's null 
                        //it shows 'null' as last name in the list.
                        const lastName = row.last_name ?? "";  
                        return row.first_name+" "+ lastName},
      sortable : true,
      grow     : 2,//width proportion.
    },
    {
      name     : "Level",
      selector : row => row.level,
      sortable : true,
      grow     : 1,
      center   : true,
    },
  ]



  //Download students excel file.
  const downloadStudentsExcel = async () => {

    const response = await axiosClient({method : 'GET', 
                                        url : '/api/students/export',
                                        responseType: 'blob',});

    //Generate, temporary URL that points directly to response.data 
    //stored in the browser's memory
    const url = window.URL.createObjectURL(
      //Convert raw data from server into  a Blob object.
        new Blob([response.data])
    );

    //Create a <a> element and point it to the url.
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students.xlsx');

    document.body.appendChild(link);

    //Simulate clicking the link to automatically download the file.
    link.click();
    link.remove();

    //Remove url from browser's memory.
    window.URL.revokeObjectURL(url);
  }



  return (
  <>
    <h1 className="title-base">Students</h1>

    <div className="w-full max-w-xl px-4 h-fit mx-auto mt-3 mb-15">
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
        data    = {filter?.sort((a, b) => a.first_name?.localeCompare(b.first_name)
                                        ||a.last_name?.localeCompare(b.last_name))}
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor"
              className="size-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add student</span>
        </button>

        <button className="button-base flex items-center 
                    justify-center bg-green-500 hover:bg-green-600"
                onClick={downloadStudentsExcel}
        >
          {/* "Table" icon  */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="size-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
          </svg>
          <span>Get Students.xls</span>
        </button>
      </div>
    </div>
  </>
  )
}
