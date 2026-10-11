import Accordion from "../components/Accordion";
import useSchool from "../hooks/useSchool";
import { useParams, useNavigate } from "react-router";
import useContent from "../hooks/useContent";
import { useEffect, useState, useRef } from "react";


export default function StudentProgress() {

  const { alphabetical } = useSchool();

  const { useChapters, useStudentProgress } = useContent();

  const {id} = useParams();
  const navigate = useNavigate();

  //Fetch all chapters.
  const { data:chapters = [],
          isLoading: isLoadingChapters,
          isError: isErrorChapters,
        } = useChapters();


  
  //Fetch only chapters seen by a single student.
  const { data:studentProgress = [],
          isLoading: isLoadingProgress,
          isError:   isErrorProgress,
        } = useStudentProgress(id);



  // Create a new data structure that combines all sections
  // with the student's progress.
  const progress = chapters.sort(alphabetical).map( (chapter) => ({
    ...chapter,
    section: chapter.section.sort(alphabetical).map( (section) => {

      const sp = studentProgress?.progress?.find(
        (sp) => sp.section_id === section.id
      );

      const seenDate = sp?.seen_date ?? null;

      //Return a new section object that includes the "seenDate" property.
      return { ...section, seenDate, };
    }),
  }));



  function StudentTitle({studentName}){
    const titleRef = useRef(null);
    const [showFixedTitle, setShowFixedTitle] = useState(false);

    useEffect(() => {
      //IntersectionObserver is a browser API for detecting when an element 
      //enters or leaves the visible area of the page.
      const observer = new IntersectionObserver(
        //entry contains information about the element being observed.
        ([entry]) => {
          //is the element intersecting the viewport?
          setShowFixedTitle(!entry.isIntersecting);
        },
        {threshold: 1}//threshold tells the observer how much of the observed element 
                      //needs to be visible before it considers the intersection 
                      //to have reached the threshold.
                      //0->0% , 0.5->50% , 1->100%
      );

      if(titleRef.current){
        observer.observe(titleRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <>
        <h1 ref={titleRef} className="title-base">
          {studentName}
        </h1>

        <div className={`
              fixed inset-x-0 top-14 z-50
              bg-white/50 backdrop-blur-sm
              shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] 
              transition-all duration-300
              ${showFixedTitle ? "translate-y-0 opacity-100"
                               : "-translate-y-full opacity-0 pointer-events-none"
              }`}
        >
          <span className="flex font-bold items-center justify-center ">
            {studentName}
          </span>
        </div>
      </>
    );
  }

  const student = studentProgress?.student?.length ? studentProgress?.student+"'s progress" : 'Content';

  return (
  <>
    <StudentTitle studentName={student} />

    <div className="accordion-container">
      { isLoadingProgress || isLoadingChapters 
        ? (<span>Fetching progress...</span>) : null}

      { isErrorProgress || isErrorChapters 
        ? (<span>Couldn't fetch progress.</span>)
        : (progress?.length > 0
           && progress.map( (chapter) => (
              <Accordion 
                key={chapter.id} 
                mode="student"
                chapter={chapter}
                sections={chapter.section} />
              ))
          )
      }
    </div>

    <div className="bottom-bar">
      <button type="button"
              className="button-base bg-blue-500 hover:bg-blue-600"
              onClick={() => {navigate("/students");}}
      >
        Back to list
      </button>

      <button type="button"
              className="button-base bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate("/students/"+id)}
      >
        Back to student
      </button>
    </div>
  </>
  )
}
