import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import useSchool from "../hooks/useSchool";
import { useApi } from "../hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      console.log("mutatuon", success)
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

    //add the "mousedown" event listener to the document
    //if user does a mousedown on any part of document, run handleClickOutside()
    if(activeSection){
      document.addEventListener("mousedown", handleClickOutside);
    }

    //Cleanup function
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeSection]);


  return (
    <>
      <div className="group w-full flex
                      p-2 hover:cursor-pointer text-lg 
                      font-bold justify-between 
                      bg-gray-200 hover:bg-gray-300"
           onClick={() => setIsOpen(!isOpen)}
      >
        {/* Chapter's name */}
        <span className="text-lg font-bold">{chapter.name}</span>

        {/* Edit & Delete options */} 
        <div className="flex items-center gap-2">
          {mode === "manage" 
            && (<div className='group-hover:block hidden text-base 
                                font-medium 
                                *:ml-2 *:hover:underline'
                >
                  <span onClick={() => {setSelChapter(chapter);
                                        handleModalChapter();
                                      }}
                  >Edit</span>
                  <span>Delete</span>
                </div>)}
          {isOpen ? <span>-</span> : <span>+</span>}
        </div>
      </div>

      {sections?.map((section, index) => (
        <div key={section.id}
             className={`${ isOpen ? "grid-rows-[1fr] opacity-100"
                                   : "grid-rows-[0fr] opacity-0"} 
                        grid overflow-visible transition-all
                        duration-300 ease-in-out`}
        >
          <div className="relative flex overflow-visible">

            {/* CLICKABLE AREA */}
            <div className="group w-full items-center 
                            flex hover:cursor-pointer hover:bg-gray-300"
                onClick={() => setActiveSection( activeSection === section.id ? null : section.id )}
            >


              {mode === "student" && (
                //Temporarily remove check input beacuse it had some conflict
                //with the bubble click.
                <p>[Icon]</p>
              )}


              <span className={`${section.seenDate ? "w-8/12" : "w-10/12"} 
                                ml-2 hover:cursor-pointer`}
              >
                {section.name}
              </span>
            </div>


            {/* Speech bubble */}
            {activeSection === section.id && (
              <div ref={bubbleRef}
                   className="group absolute left-4/12 
                             -translate-y-11/12 p-2 ml-3 
                             bg-white rounded-lg z-50
                             border border-gray-300 shadow-lg
                             hover:bg-slate-100"
              >
                {/* Arrow */}
                <div className="absolute left-1/2 top-full
                                -translate-x-1/2 w-0 h-0
                                border-l-8 
                                border-l-transparent 
                                border-r-8
                                border-r-transparent 
                                border-t-8 
                                border-t-white
                                group-hover:border-t-slate-100"
                />

                {/* Options */}
                {mode === "student" &&
                  (<div className="flex justify-center items-center"
                        onClick={() => handleSubmit(section.id)}>
                    <span className="text-sm hover:underline">
                      Click here to mark as seen.
                    </span>
                  </div>)
                }

                {mode === "manage" && confirmDelete === false &&
                  (<div className="flex justify-center items-center 
                                   *:px-2 *:py-1 *:hover:underline
                                   *:text-sm *:hover:cursor-pointer"
                    >
                    <span onClick={()=>{handleModalSection();
                                        setActiveSection(null);
                                        setSelSection(section);
                     }}>
                      Edit
                    </span>
                    <span onClick={() => setConfirmDelete(true)}>Delete</span>
                  </div>)
                }

                {mode === "manage" && confirmDelete === true &&
                  ( <div className="flex">
                      <span>Delete section?</span>

                      <div className="*:m-1 *:font-bold *:hover:underline
                                      *:hover:cursor-pointer"
                      >
                        <span onClick={() => {setConfirmDelete(false);
                                              setActiveSection(null);}}
                        >No</span>
                        <span>
                          Yes
                        </span>
                      </div>
                    </div>
                  )
                }
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

