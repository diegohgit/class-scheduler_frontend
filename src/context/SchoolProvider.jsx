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

	const [ modal, setModal ] = useState(0);
	const [ time, setTime]    = useState([]);
	const [ classModal, setClassModal ] = useState(0);

	const handleClickModal = () => {
		setModal(!modal)
	}

	const handleSetTime = ({day, hour}) => {
		setTime([{"day": day, "hour":hour}]);
	}

	const handleClassModal = (classModal) => {
		setClassModal(classModal)
	}

	const today = new Date().toLocaleDateString("en-US", {
					weekday: 'long'
				});

	return (
		<SchoolContext.Provider 
			value = {{
				customStyles,
				handleClickModal,
				modal,
				handleSetTime,
				time,
				handleClassModal,
				classModal,
				today,
			}}
		>{children}
		</SchoolContext.Provider>
	)
}

export default SchoolContext

export {
	SchoolProvider
}
