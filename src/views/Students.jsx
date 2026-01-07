
export default function Students() {
  return (
	<>
		<div className="flex items-center justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" 
				fill="none" 
				viewBox="0 0 24 24" 
				stroke-width="1"
				stroke="currentColor" 
				class="size-40">
				<path 
					stroke-linecap="round" 
					stroke-linejoin="round" 
					d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
			</svg>			
		</div>

		<div className="flex border border-green-400 items-center justify-center">

			<form className="w-8/12">
				<div className=" mb-4 border border-amber-500">
					<p className="font-bold mb-1">Name:</p>
					<input 
						className="input-base"
						placeholder="Student's name"
						type="text" />
				</div>
				<div className="flex">
					<div className="w-6/12 mb-4 mr-3 border border-amber-500">
						<p className="font-bold mb-1">Age:</p>
						<input 
							className="input-base"
							placeholder="Student's age"
							type="text" />
					</div>
					<div className="w-6/12 mb-4 border border-amber-500">
						<p className="font-bold mb-1">English level:</p>
						<select 
							className="input-base"
							placeholder="Student's english level"
							type="text">
							<option value="1">A1</option>
							<option value="2">A2</option>
							<option value="3">B1</option>
							<option value="4">B2</option>
							<option value="5">C1</option>
							<option value="6">C2</option>
						</select>
					</div>
				</div>

				<p className="font-bold">Homework:</p>
				<textarea className="textarea-base" name="homework" id="homework"></textarea>

				
				<p className="font-bold mb-1">Schedule Color:</p>
				<div className="flex">
					<div className="circle-color bg-red-400"></div>
					<div className="circle-color border-amber-500"></div>
					<div className="circle-color bg-yellow-300"></div>
					<div className="circle-color bg-lime-300"></div>
					<div className="circle-color bg-teal-300"></div>
					<div className="circle-color bg-cyan-300"></div>
					<div className="circle-color bg-blue-500"></div>
					<div className="circle-color bg-indigo-300"></div>
					<div className="circle-color bg-fuchsia-300"></div>					
				</div>

				
				<p className="font-bold mb-1">Student's classes:</p>
				<div className="flex mb-4">
					<div className="w-30 h-20 bg-gray-100 pt-1 mr-2 
									text-center rounded hover:cursor-pointer hover:bg-blue-200">
						<p className="text-center font-bold text-transform: uppercase
							mt-4">
							TUE
						</p>
						<p>10:00</p>
					</div>
					<div className="w-30 h-20 bg-gray-100 pt-1 mr-2
									text-center rounded hover:cursor-pointer hover:bg-blue-200">
						<p className="text-center font-bold text-transform: uppercase
							mt-4">
							THU
						</p>
						<p>11:00</p>
					</div>
					<div className="w-30 h-20 bg-gray-100 pt-1 mr-2
									text-center rounded hover:cursor-pointer hover:bg-blue-200">
						<p className="text-center font-bold text-transform: uppercase
							mt-4">
							FRI
						</p>
						<p>11:00</p>
					</div>					
				</div>

				<p className="font-bold mb-1">General Progress:</p>
				<textarea className="textarea-base" name="homework" id="homework"></textarea>


			</form>

		</div>


	</>
  )
}
