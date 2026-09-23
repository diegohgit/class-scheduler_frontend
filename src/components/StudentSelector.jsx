import { useEffect, useRef, useState } from "react"
import useSchool from "../hooks/useSchool";
import { useStudents } from "../hooks/useStudents";

//This component is used to display and modify data.
//When its displaying data the user can click on it
//and it will switch to an input usefull to search students
export default function StudentSelector() {

  const { selStudent, filterStudents, setSelStudent } = useSchool()



  //editInfo state is used to show the search input 
  //and show the <p> element which displays the student's name.
  const [ editInfo, setEditInfo ] = useState(!selStudent?.id);
  const inputRef = useRef(null);



  //Manage search input's behavior and hide search results list
  useEffect(() => {
    /*Select all text contained in the search input 
       when user wants to edit student
       or focus input If the block selected doesn't have info. */
    if(editInfo || !selStudent?.id) inputRef.current?.select();

  }, [editInfo, selStudent]);



  /*States useful for:
    - Store search results.
    - Show/hide div which shows search results.
  */
  const [showResults, setShowResults] = useState(false);



  //Get students using useStudents()
  const { data:records = [],
          isLoading,
        } = useStudents();



  const [results, setResults] = useState([]);

  //Function to handle student search
  const handleSearch = (inpValue) => {

    //If user erases all letters
    //- Empty results state
    //- Hide results div
    if(!inpValue.length){ 
      setResults([]);
      setShowResults(false);
      return;
    }

    //Call filterStudents() to search for students,
    //pass "records" which contains all of the students.
    setResults(filterStudents(records, inpValue))
    setShowResults(true);
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
          - Set inputRef value back to selStudent.name
            in case the user had written something.
          - If theres a student selected, deactivate editInfo state.
        */
        setShowResults(false);
        inputRef.current.value = selStudent?.name || null;
        
        if(selStudent?.id) setEditInfo(false);
      }
    }

    if(showResults || editInfo){
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showResults, editInfo, selStudent])



  //Handle navigation throught results using arrow keys.
  const [selIndex, setSelIndex] = useState(-1);

  const handleKeyDown = (e) => {
    if(!results?.length) return;

    if(e.key === 'ArrowDown'){
      e.preventDefault();

      //Adjust index:
      //Add +1 to the current index when the user presses ArrowDown.
      //In the last position it ask if 3 is greater than results.length -1
      //As response is false, it sets the state to position 0.
      setSelIndex((prev) => prev < results.length -1 ? prev + 1 : 0);
    }

    if(e.key === 'ArrowUp'){
      e.preventDefault();

      setSelIndex((prev) => prev > 0 ? prev -1 : results.length -1 );
    }

    if(e.key === 'Enter'){
      e.preventDefault();

      if(selIndex >= 0){
        const student = results[selIndex];

        handleSelectStudent(student);
      }
    }
  }



  /* If user clicks a result
      - Set selStudent state to the selected student.	
      - Set editInfo state to false to hide search input.
      - Set showResults state to false to hide list of results.
  */
  const handleSelectStudent = (student) => {

    setSelStudent({ id   : student?.id,
                    name : student?.first_name +" "+ (student?.last_name ?? ""),
                    class_notes      : student?.class_notes ?? null,
                    class_notes_date : student?.class_notes_date ?? null,});

    setEditInfo(false);
    setShowResults(false);
  }



  return (
    <>

    {/* If user doesn't want to edit student, display Student's name*/}
    { editInfo === false ?

      /* Display student's name
        - This element will be hidden when the user is in edit mode
           or when theres no selStudent, which means that the user 
           opened an empty space.
      */
      (
        selStudent?.id &&
        <div className = "flex hover:cursor-pointer"
            onClick={() => setEditInfo(true) }
            title="Click to edit student"
        >
          <p className="underline underline-offset-2 mr-2">
            {selStudent.name}
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </div>

      ):(
      //Show input to search for students

      <div ref={divResultsRef}>  
        <input ref={inputRef}
               type="text"
               className="input-base"
               defaultValue={selStudent?.name}
               placeholder="Search for student..."
               onChange={(e) => {
                            handleSearch(e.target.value)
                            setSelIndex(-1)
               }}
               onKeyDown={handleKeyDown}
            />


      {/* List of results */}
      { showResults 
        && <ul className="w-9/10 bg-white absolute 
                          rounded-b-lg border border-sky-300">
        
          { showResults && !results?.length 
            && <li className="h-8 text-center">No matches found.</li>}

          { isLoading && showResults 
            && <li className="h-8 text-center">Searching...</li>}

          { results?.map((result, index) => 
            {
              return <li  key={result.id}
                        className={`${isLoading ? 'hidden' : ''}
                                    ${selIndex === index ? 'bg-gray-200' : ''}
                                    h-8 hover:bg-gray-200 hover:cursor-pointer
                                    pl-2`}
                        onMouseEnter={() => setSelIndex(index)}
                        onClick={() => handleSelectStudent(result)}
                      >
                        {result?.first_name +" "+ (result?.last_name ?? "")}
                      </li>
            })
          }
        </ul>}
      </div>
      )}
    </>
  )
}
