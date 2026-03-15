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

  //State to show/hide the modal 
  const handleClickModal = () => {
    setModal(!modal)
  }

  //Get all the time parameters to be displayed on the modal
  const handleSetTime = ({day, currTime, emptyClassEnd}) => {
    //Get the hour part from currTime to calculate nextHour
    const currHour = currTime.split('.')[0]
    const nextHour = parseInt(currHour) + 1;

    // IF emptyClassEnd has a value, ends will be the start of the next class 
    // that starts in the same hour (currentHour + emptyClassEnd)
    // ELSE, ends will be the start of the next block (nextHour + '.00')
    const ends = emptyClassEnd ? currHour+'.'+emptyClassEnd : nextHour+'.00';

    setTime([{"day": day, "time":currTime, "ends": ends}]);
  }

  //State used to send class information to the modal
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

  const [loading, setLoading] = useState(false);

  //Function to get students from DB
  //If it receives an id, it will return only that student
  //otherwise, it will return all the students
  const getStudents = async (id = null) => {
    setLoading(true);

    try{
      const url = id ? `/api/students/${id}` : '/api/students/';
      const { data } = await axiosClient(url);

      return data.data;
    }catch(error){
      console.log("OCURRIO UN ERROR");
      console.log(error);
    }finally{
      setLoading(false);
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
        loading
      }}
    >{children}
    </SchoolContext.Provider>
  )
}

export default SchoolContext

export {
  SchoolProvider
}
