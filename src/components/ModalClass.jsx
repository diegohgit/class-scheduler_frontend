import useSchool from "../hooks/useSchool";
import { useState } from 'react';
import DivInput from "./DivInput";

export default function ModalClass() {

	const { time, handleClickModal, classModal, today } = useSchool();
	const [timer, setTimer] = useState('10:00');
	const [duration, setDuration] = useState(0);

	const studentsName = classModal?.student;
	const hiddenToday  = classModal.dayLabel != today ? 'hidden' : '';
	const timeInput    = "!w-20 mx-2";
	const start = classModal?.hour;
	const ends  = classModal?.ends;

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
				<div className="h-15">
					<b>Student:</b>
					<DivInput
						info = {studentsName}
					/>
				</div>
				<div className="flex mt-2">
					<b className="mr-2">Day:</b> {time[0].day.label} 
					<p className={`${hiddenToday} ml-2`}>(Today)</p>
				</div>
				<div className="h-10 mt-3 flex">
					<div className="w-5/12 flex">
						<b className="mr-2">Start:</b>
						<DivInput
							info = {start}
							style= {timeInput}
						/>
					</div>
					<div className="w-5/12 flex">
						<b className="ml-8 mr-2"> Ends:</b>
						<DivInput
							info = {ends}
							style= {timeInput}
						/>
					</div>
				</div>
				<div className="flex">
					<b className="mr-2">Duration: </b>
					<p className="mr-1">60 mins</p>
				</div>
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