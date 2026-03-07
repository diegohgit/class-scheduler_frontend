import { createContext, useState, useEffect } from "react"
import { useBlocker } from "react-router-dom";
import axiosClient from "../config/axios";

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


  const useChangesProtection = (isDirty) => {
    const blocker = useBlocker(isDirty)

    // Warn user of unsaved changes when trying 
    // to navigate to a different route
    useEffect(() => {
      if(blocker.state !== "blocked") return;

      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );

      confirm ? blocker.proceed() : blocker.reset();
    }, [blocker]);

    // Warn user of unsaved changes when trying to close the tab or browser
    //it also works when trying to refresh the page
    useEffect(() => {
      const handler = (e) => {
        if (!isDirty) return;

        //Stop the unload process
        e.preventDefault();

        //Chrome requires returnValue to be set
        e.returnValue = "";
      };

      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);
  }

  const [students, setStudents] = useState([])
  const getStudents = async (id = null) => {
    try{
      const url = id ? `/api/students/${id}` : '/api/students/';
      const {data} = await axiosClient(url);
      setStudents(data.data)
    }catch(error){
      console.log("OCURRIO UN ERROR");
      console.log(error)
    }
  }

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
        useChangesProtection,
        getStudents,
        students
      }}
    >{children}
    </SchoolContext.Provider>
  )
}

export default SchoolContext

export {
  SchoolProvider
}
