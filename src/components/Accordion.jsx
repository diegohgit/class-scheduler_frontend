import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import useSchool from "../hooks/useSchool";
import { useApi } from "../hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingMessage from "./LoadingMessage";
import useContent from "../hooks/useContent";

export default function Accordion({mode, chapter, sections}) {

  const [isOpen, setIsOpen] = useState(mode === "student" ? true:false);
  const [ loadingMsg, setLoadingMsg ] = useState("");

  const { handleModalChapter, setSelChapter, setSelSection,
          handleModalSection, getFormattedDate, } = useSchool();

  const { useChapterMutation, useSectionMutation } = useContent();

  const { id } = useParams();



  const { request } = useApi();

  //Async function to send requests to mark a section as seen.
  const handleRequest = async ({markData, method}) => {

    const url = method ? `api/students/${id}/progress`
                          : `api/students/${id}/progress/${markData.section_id}`;
    const method_send  = method ? "POST" : "DELETE";
    const message      = method ? "Section marked as seen." : "Section marked as not seen.";

    const { success } = await request(method_send,
                                      url,
                                      markData,
                                      message);
    return success;
  }



  //Mutation to mark/unmark a section as seen.
  const queryClient = useQueryClient();

  const markMutation = useMutation({
    mutationFn: ({markData, method}) => handleRequest({markData, method}),
    onSuccess: async (success) => {

      if(success){
        await queryClient.refetchQueries({queryKey:["studentProgress", id]});
      }
    }
  })



  //Validate data and run markMutation.
  const handleSubmit = (section_id, method) => {

    if(mode === "student" && id && section_id){

      const markData = { "student_id" : Number(id), "section_id" : Number(section_id)};
      markMutation.mutate({markData, method});
    }
  }



  const [ confirmSectionDelete, setConfirmSectionDelete ] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const bubbleRef = useRef(null);

  //Hide bubble dialog when user clicks outside of it.
  useEffect(() => {
    function handleClickOutside(event){
      
      if(bubbleRef.current && !bubbleRef.current.contains(event.target)){
        setActiveSection(null);
        setConfirmSectionDelete(false);
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



  const [ confirmChapterDelete, setConfirmChapterDelete ] = useState(false);
  const [ activeChapter, setActiveChapter ] = useState(null); 
  const confDeleteChapterRef = useRef(null);
  //Hide confirm delete options when user clicks outside of it.
  useEffect(() => {
    function handleClickOutside(event){
      
      if(confDeleteChapterRef.current && !confDeleteChapterRef.current.contains(event.target)){
        setIsOpen(false);
        setActiveChapter(null)
        setConfirmChapterDelete(false);
      }
    }

    //Add the "mousedown" event listener to the document
    //if user does a mousedown on any part of document, run handleClickOutside()
    if(confirmChapterDelete === true  ){
      document.addEventListener("mousedown", handleClickOutside);
    }

    //Cleanup function
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [//activeConfDelChapter, 
      confirmChapterDelete]);



  //Mutation to delete chapters.
  const chapterMutation = useChapterMutation();

  const setChapterMutation = (chapter_id) => {

    const data = { "id" : chapter_id, };

    chapterMutation.mutate({"table" : "chapters",
                            data,
                            "method" : "DELETE",});
  }



  //Mutation to delete sections.
  const sectionMutation = useSectionMutation();

  const setSectionMutation = (section_id) => {

    const data = { "id" : section_id, };

    sectionMutation.mutate({"table" : "sections",
                            data,
                            "method" : "DELETE",});
  }



  //Get seen label with the formatted date.
  const getSeenLabel = (date) => {
    const formattedDate = getFormattedDate(date);

    const label = formattedDate.includes("/") ? `Seen on ${formattedDate}` 
                                              : `Seen ${formattedDate}`;
    return label;
  }



  return (
    <>
      {markMutation.isPending    && <LoadingMessage text={loadingMsg}/>}
      {sectionMutation.isPending && <LoadingMessage text="Deleting section..."/>}
      {chapterMutation.isPending && <LoadingMessage text="Deleting chapter..."/>}

      {/* CHAPTER HEADER */}
      <div
        className="w-full relative flex
                   py-2 px-2 font-bold 
                   text-lg bg-gray-200"
      >

        {/* CHAPTER NAME */}
        <span className={`${activeChapter === chapter.id ? "bg-blue-200 " 
                                                         : "bg-gray-200 hover:bg-gray-300" }
                          w-9/12 text-lg font-bold
                          p-2 cursor-pointer hover:bg-gray-300`}
              onClick={() => setIsOpen(!isOpen)}
        >{chapter.name}</span>


        {/* EDIT AND DELETE CHAPTER OPTIONS */}
        <div className="flex ml-auto gap-2"
             ref={confDeleteChapterRef}>

          {mode === "manage" && (
            confirmChapterDelete === false ?
            ( <div className='group-hover:block text-base 
                              font-medium my-auto
                              *:ml-2 *:hover:underline *:cursor-pointer'
              >
                <span onClick={() => {setSelChapter(chapter);
                                      handleModalChapter();}}
                >Edit</span>

                <span onClick={() => {setConfirmChapterDelete(true);
                                      setActiveChapter(chapter.id)
                                      setIsOpen(true);}}
                >Delete</span>
              </div>

          ) : (<div className='text-base text-center font-medium'>
              {/* CONFIRM DELETE CHAPTER */}
                <span className="text-sm">Delete chapter and<br></br>its sections?</span>

                <div className="text-center *:px-2 *:font-bold 
                                *:hover:underline *:cursor-pointer">
                  <span onClick={() => {setConfirmChapterDelete(false);
                                        setIsOpen(false);
                                        setActiveChapter(null);}}
                  >No</span>

                  <span onClick={() => {setConfirmChapterDelete(false);
                                        setChapterMutation(chapter.id);}}
                  >Yes</span>
                </div>
              </div>))
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
              {mode === "student" && section.seenDate && (
                <span className="ml-auto text-sm italic
                                text-gray-600"
                >{getSeenLabel(section.seenDate)}</span>
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
                  {mode === "student" && (section.seenDate === null ?
                    ( <div className="flex justify-center items-center
                                      p-2 hover:cursor-pointer"
                           onClick={() => {handleSubmit(section.id, true)
                                           setActiveSection(null);
                                           setLoadingMsg("Marking as seen...")}
                                  }
                      >
                        <span className="text-sm hover:underline">
                          Click here to mark it as seen.
                        </span>
                      </div>
                    ) : ( 
                      <div className="flex justify-center items-center
                                      p-1 hover:cursor-pointer"
                      >
                        <span className="text-sm hover:underline">
                          Mark it as not seen?
                        </span>
                        <div className="*:m-1 *:font-bold *:text-sm
                                        *:hover:underline *:hover:cursor-pointer"
                        >
                          <span onClick={() => {setActiveSection(null);}}
                          >No</span>

                          <span onClick={() => {handleSubmit(section.id, false);
                                                setActiveSection(null);
                                                setLoadingMsg("Marking as not seen...")
                                                }}
                          >Yes</span>
                        </div>
                      </div>))
                  }

                  {/* MANAGE OPTIONS */}
                  {mode === "manage" && (
                    confirmSectionDelete === false ? (
                      <div className="flex
                                      *:p-2 *:hover:underline
                                      *:text-sm *:hover:cursor-pointer"
                      >
                        <span onClick={() => {handleModalSection();
                                              setActiveSection(null);
                                              setSelSection(section);
                                            }}
                        >Edit</span>

                        <span onClick={() => setConfirmSectionDelete(true)}
                        >Delete</span>
                      </div>
                    ) : (

                      /*{ CONFIRM DELETE }*/
                      <div className="flex p-2 text-sm">
                        <span>Delete section?</span>

                        <div className="*:m-1 *:font-bold *:hover:underline
                                        *:hover:cursor-pointer"
                        >
                          <span onClick={() => {setConfirmSectionDelete(false);
                                                setActiveSection(null);}}
                          >No</span>

                          <span onClick={() => {setConfirmSectionDelete(false);
                                                setActiveSection(null);
                                                setSectionMutation(section.id);
                                              }}
                          >Yes</span>
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

