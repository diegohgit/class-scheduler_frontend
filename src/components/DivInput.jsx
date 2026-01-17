import { useEffect, useRef, useState } from "react"

export default function DivInput({info, style = ""}) {
	//This component is used to display and modify data
	//when it is displaying data the user can click on it
	//and it will switch to an input that contains the data

	const [ editInfo, setEditInfo ] = useState(0)
	const inputRef = useRef(null);

	const hiddenDiv = editInfo ? 'hidden' : '';
	const hiddenInp = editInfo ? '' : 'hidden';

	useEffect(() => {
		if(editInfo){
			//If we find an element in inputRef,
			//we run its focus() property
			inputRef.current?.focus();
		}
	}, [editInfo]);

	return (
		<>
			<div 
				className={`${hiddenDiv} flex hover:cursor-pointer`}
				onClick={() => setEditInfo(1)}
			>
				<p className="underline underline-offset-2 mr-2">
					{info}
				</p>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  					<path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
				</svg>

			</div>

			<input 	type="text" 
					className={`${hiddenInp} input-base ${style}`}
					defaultValue={info}
					ref={inputRef}
					onBlur={() => setEditInfo(0)}
			/>
		</>
	)
}
