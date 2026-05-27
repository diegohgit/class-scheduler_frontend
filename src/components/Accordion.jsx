import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import useSchool from "../hooks/useSchool";
import { useApi } from "../hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingMessage from "./LoadingMessage";

export default function Accordion({mode, chapter, sections}) {

  const [isOpen, setIsOpen] = useState(mode === "student" ? true:false);

  const [ confirmDelete, setConfirmDelete ] = useState(false);

  const { handleModalChapter, setSelChapter, setSelSection,
          handleModalSection } = useSchool();

  const { id } = useParams();



  const { request } = useApi();

  //Async function to send requests to mark a section as seen.
  const handleRequest = async (markData) => {

    const url = `api/students/${id}/progress`;
    const { success } = await request("POST",
                                      url,
                                      markData,
                                      "Section marked as seen.");
    return success;
  }



  const queryClient = useQueryClient();

  const markMutation = useMutation({
    mutationFn: (markData) => handleRequest(markData),
    onSuccess: async (success) => {

      if(success){
        await queryClient.refetchQueries({queryKey:["studentProgress", id]});
      }
    }
  })



  //Validate data and run mutation.
  const handleSubmit = (section_id) => {

    if(mode === "student" && id && section_id){

      const markData = { "student_id" : Number(id), "section_id" : Number(section_id)};
      markMutation.mutate(markData);
    }
  }



  const [activeSection, setActiveSection] = useState(null);
  const bubbleRef = useRef(null);
  //Hide bubble dialog when user clicks outside of it.
  useEffect(() => {
    function handleClickOutside(event){
      
      if(bubbleRef.current && !bubbleRef.current.contains(event.target)){
        setActiveSection(null);
        setConfirmDelete(false);
      }
    }

    //Add the "mousedown" event listener to the document
    //if user does a mousedown on any part of document, run handleClickOutside()
    if(activeSection){
      document.addEventListener("mousedown", handleClickOutside);
    }

    //Cleanup function
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeSection, bubbleRef]);


  return (
    <>
      {markMutation.isPending && <LoadingMessage text="Marking as seen..."/>}

      {/* CHAPTER HEADER */}
      <div
        className="w-full relative z-0 flex cursor-pointer
                   py-2 px-2 font-bold text-lg
                   bg-gray-200 hover:bg-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >

        {/* CHAPTER NAME */}
        <span className="text-lg font-bold">{chapter.name}</span>


        {/* Edit & Delete options */}
        <div className="flex ml-auto gap-2">
          {mode === "manage" &&
            ( <div className='group-hover:block text-base 
                              font-medium 
                              *:ml-2 *:hover:underline'
              >
                <span onClick={() => {setSelChapter(chapter);
                                      handleModalChapter();
                                    }}
                >Edit</span>
                <span>Delete</span>
              </div>)
          }
          <div className="w-2">
            {isOpen ? <span>-</span> : <span>+</span>}
          </div>
        </div>
      </div>



      {/* ACCORDION CONTENT */}
      <div className={`${isOpen ? "max-h-[1000px] overflow-visible"
                                : "max-h-0 overflow-hidden"}
                     transition-all duration-300 `}
      >
        {sections?.map((section) => (
          <div  key={section.id}
                onClick={() => setActiveSection(
                                 activeSection === section.id ? null : section.id)}
                className="relative"
          >
            {/* SECTION ROW */}
            <div className={`${activeSection === section.id ? "bg-blue-200 " 
                                                            : "bg-gray-200 hover:bg-gray-300" }
                            items-center flex w-full
                            cursor-pointer px-2 py-2`}
            >
              {/* CHECKED ICON */}
              {mode === "student" && (
                section.seenDate !== null ? (

                  <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" 
                        className="ml-2 size-5.5 rounded-full bg-green-400 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ) : ( <div className="ml-2 h-5.5 w-5.5 rounded-full border border-gray-500 "></div>))
              }

              {/* SECTION NAME */}
              <span className="px-2">{section.name}</span>

              {/* SEEN DATE */}
              {mode === "student" && section.seenDate !== null && (
                <span className="ml-auto text-sm italic
                                 text-gray-600"
                >Seen on {section.seenDate}</span>
                )
              }
            </div>



            {/* BUBBLE */}
            {activeSection === section.id &&
              ( <div ref={bubbleRef}
                     onClick={(e) => e.stopPropagation()}
                     className="group absolute top-7
                                left-8 z-50 mt-2 
                                bg-white rounded-lg shadow-lg 
                                hover:bg-slate-100"
                >
                  {/* Arrow */}
                  <div className="absolute bottom-8 translate-x-11/12
                                  w-0 h-0
                                  border-l-8
                                  border-l-transparent 
                                  border-r-8
                                  border-r-transparent
                                  border-b-10
                                  border-b-white
                                  group-hover:border-b-slate-100"
                  />

                  {/* MARK AS SEEN OPTION*/}
                  {mode === "student" &&
                    ( <div className="flex justify-center items-center
                                      p-2 hover:cursor-pointer"
                          onClick={() => {handleSubmit(section.id)
                                          setActiveSection(null);}
                                  }
                      >
                        <span className="text-sm hover:underline">
                          Click here to mark it as seen.
                        </span>
                      </div>
                    )
                  }

                  {/* MANAGE OPTIONS */}
                  {mode === "manage" && (
                    confirmDelete === false ? (
                      <div className="flex
                                      *:p-2 *:hover:underline
                                      *:text-sm *:hover:cursor-pointer"
                      >
                        <span onClick={() => {handleModalSection();
                                              setActiveSection(null);
                                              setSelSection(section);
                                            }}
                        >Edit</span>

                        <span onClick={() => setConfirmDelete(true)}
                        >Delete</span>
                      </div>
                    ) : (

                      /*{ CONFIRM DELETE }*/
                      <div className="flex p-2 text-sm">
                        <span>Delete section?</span>

                        <div className="*:m-1 *:font-bold *:hover:underline
                                        *:hover:cursor-pointer"
                        >
                          <span onClick={() => {setConfirmDelete(false);
                                                setActiveSection(null);}}
                          >No</span>

                          <span>Yes</span>
                        </div>
                      </div>
                      )
                    )
                  }{/* MANAGE OPTIONS */}
                </div>
              )
            }{/* BUBBLE */}
          </div>
        ))}{/* SECTIONS MAP() */}
      </div>
    </>
  )
}

