import { createContext, useState } from "react"

const SchoolContext = createContext();
const customStyles = {
		content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		},
	};

const SchoolProvider = ({children}) => {

	const hola = 'holaaaa';
	const [ modal, setModal ] = useState(0);
	const [ time, setTime]    = useState([]);
	const [ lastClass, setLastClass] = useState(0);
	const [ crossHr, setCrossHr] = useState(0);

	const handleClickModal = () => {
		setModal(!modal)
	}

	const handleSetTime = ({day, hour}) => {
		setTime([{"day": day, "hour":hour}]);
	}

	const handleSetCrossHr = ({isCross}) => {
		setCrossHr(isCross)
	}

	return (
		<SchoolContext.Provider 
			value = {{
				customStyles,
				handleClickModal,
				modal,
				handleSetTime,
				time,
				handleSetCrossHr,
				crossHr
			}}
		>{children}
		</SchoolContext.Provider>
	)
}

export default SchoolContext

export {
	SchoolProvider
}
