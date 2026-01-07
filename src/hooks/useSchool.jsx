import { useContext } from "react";
import SchoolContext from "../context/SchoolProvider";

const useSchool = () => {
    return useContext(SchoolContext);
}

export default useSchool;
