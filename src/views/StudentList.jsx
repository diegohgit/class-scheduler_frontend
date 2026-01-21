import DataTable from "react-data-table-component";
import { useState } from "react";

export default function StudentList() {

	const students = [
					{id:1	, name:"Diego Hernández", level:"C1"},
					{id:2	, name:"Marcela Briones", level:"B1"},
					{id:3	, name:"Danae Reyes", 		level:"C2"},
					{id:4	, name:"Eduardo García", 	level:"B2"},
					{id:5	, name:"Brayan Cruz", 		level:"B2"},
					{id:6	, name:"Metzi Castillo", 	level:"B2"},
					{id:7	, name:"Pablo Indalta", 	level:"C2"},
					{id:8	, name:"David Jauregui", 	level:"C2"},
					{id:9	, name:"Fernando Cortez",	level:"B1"},
					{id:10, name:"Jesús García",		level:"B2"},
					{id:11, name:"Abraham Montalvo",level:"B2"},
					{id:12, name:"Edgar Zamora",	  level:"B2"},
	 			];

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

	const [records, setRecords] = useState(students)

	const handleChange = (e) => {
		const filteredRecors = students.filter(record => {
			return record.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
						 record.level.toLowerCase().includes(e.target.value.toLowerCase());
		})

		setRecords(filteredRecors)
	}

  return (
	<>
		<h1 className="text-center font-bold text-4xl">Students</h1>

		<div className="w-6/12 h-90 mx-auto my-3">
			<div class="relative w-64 mx-auto">
				<input
					type="text"
					className="input-base my-2 text-sm"
					placeholder="Search for student..."
					onChange={handleChange}
				/>

				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
					</svg>
				</div>
			</div>
			<DataTable 
				columns={columns}
				data={records}
				pagination
				paginationPerPage={10}
				onRowClicked={(row, e) => {
						console.log(row.id);
				}}
			/>
		</div>

	</>
  )
}
