import useSchool from "../hooks/useSchool";

export default function ModalClass() {

	const {time, handleClickModal} = useSchool();

	return (
		<>
			<div className="flex mb-5">
				<h2 className="w-11/12 text-2xl font-bold">Class Information</h2>
				<div className="flex justify-end">
					<button 
						className="hover:cursor-pointer"
						onClick={handleClickModal}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" 
							viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
							className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</div>				
			</div>

			<div>
				<b>Student:</b> Diego Hernández Hernández
				<br />
				<b>Day:</b> {time[0].day.label} (Today)
				<br />
				<b>Start:</b> {time[0].hour}:00

			</div>
			<div>
				<button className="w-40 h-8 rounded 
								bg-red-500 text-white font-bold 
								m-2 hover:cursor-pointer hover:bg-red-600">
					Cancel Class
				</button>
				<button className="w-40 h-8 rounded 
								bg-indigo-500 text-white font-bold 
								m-2 hover:cursor-pointer hover:bg-indigo-600">
					Ok
				</button>
			</div>
		</>
	)
}
