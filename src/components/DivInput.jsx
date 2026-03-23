import { useEffect, useRef, useState } from "react"
import useSchool from "../hooks/useSchool";

//This component is used to display and modify data.
//When its displaying data the user can click on it
//and it will switch to an input usefull to search students
export default function DivInput({info, style = ""}) {

  //editInfo state is used to show the search input 
  // and show the <p> element which displays the student's name.
  const [ editInfo, setEditInfo ] = useState(0)
  const inputRef = useRef(null);

  //Manage search input's behavior and hide search results list
  useEffect(() => {
    //Select all text contained in the search input 
    //when user wants to edit student
    //or focus input If the block selected doesn't have info.
    if(editInfo || !info) inputRef.current?.select();

  }, [editInfo, info]);

  const { getStudents } = useSchool()
  /*States to:
    - Store search results
    - Show/hide div which shows search results
    - Store selected student
  */
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(0);
  const [selStudent, setSelStudent] 	= useState(info);

  //Send request to search for students 
  const handleSearch = (value) => {
    const fetchResults = async () => {
      const response = await getStudents(null, value);
      setResults(response);
    }

    if(value.length) setShowResults(1);
    else setResults([]);

    if(value.length > 2) fetchResults();
  }

  //Handle div where the search results are displayed
  const divResultsRef = useRef(null);
  useEffect(() => {
    //This will be executed when user clicks outside divResults 
    function handleClickOutside(e){
      //If results are being displayed or editInfo is active.
      //For more info see TimeSelector.jsx comments.
      if(divResultsRef.current 
         && !divResultsRef.current.contains(e.target)
         && (showResults || editInfo))
      {
        /*- Hide divResults and search input.
          - Set inputRef value back to selStudent
            in case the user had written something.
          - Deactivate editInfo state.
        */
        setShowResults(0);
        inputRef.current.value = selStudent;
        setEditInfo(0);
      }
    }

    if(showResults){
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showResults, editInfo])


  return (
    <>
      {/* Display student's name
        - This element will be hidden when the user is in edit mode
           or when theres no selStudent, which means that the user 
           opened an empty block.
      */}
      <div className={`${editInfo || !selStudent ? 'hidden':''} flex hover:cursor-pointer`}
           onClick={() => setEditInfo(1)}
      >
        <p className="underline underline-offset-2 mr-2">
          {selStudent}
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </div>

      {/* Div container to show/hide search input and list of results */}
      <div ref={divResultsRef}>
        {/* search input */}
        <input type="text" 
            className={`${editInfo || !selStudent ? '':'hidden'} input-base ${style}`}
            defaultValue={selStudent}
            placeholder="Search for student..."
            ref={inputRef}
            onChange={(e) => handleSearch(e.target.value)}
            />
        {/* List of results */}
        <ul className={`${showResults ? '' : 'hidden'}
                        w-9/10 bg-white absolute 
                        rounded-b-lg border border-sky-300`}
        >
          <li className={`${!results.length && showResults ? '':'hidden'} h-8 text-center`}>
            No matches found.
          </li>

          {results.map((result) => {
            return <li  key={result.id}
                        className="h-8 hover:bg-gray-200 hover:cursor-pointer
                                  pl-2"
                        onClick={() => {
                  {/* If user clicks a result
                      - Set selStudent state to the selected student.	
                      - Set editInfo state to 0 to hide search input.
                      - Set showResults state to 0 to hide list of results.
                      - Set search input's value to the selected student
                        in case the user wanted to make another search.
                  */}
                          setSelStudent(result.name);
                          setEditInfo(0);
                          setShowResults(0);
                          inputRef.current.value = result.name;
                        }}
                    >
                      {result.name}
                    </li>
             })
          }
        </ul>
      </div>
    </>
  )
}
