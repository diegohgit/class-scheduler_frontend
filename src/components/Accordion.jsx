import { useState } from "react";
import { useParams } from "react-router-dom";
import useSchool from "../hooks/useSchool";
import { useApi } from "../hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Accordion({mode, chapter, sections}) {

  const [isOpen, setIsOpen] = useState(mode === "student" ? true:false);

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
  const handleSubmit = (e) => {
    e.preventDefault();

    if(mode === "student"){
      const section_id = e.target.id;

      if(id && section_id){
        const markData = { "student_id" : Number(id), "section_id" : Number(section_id)};
        markMutation.mutate(markData);
      }
    }
  }



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
                                *:ml-2 *:hover:underline'>

                  <span onClick={() => {setSelChapter(chapter);
                                        handleModalChapter();}}
                      >Edit</span>

                  <span>Delete</span>
                </div>)}
          {isOpen ? <span>-</span> : <span>+</span>}
        </div>
      </div>

      {sections?.map( (section) => (
        <div
          key={section.id}
          className={`${isOpen ? 'grid-rows-[1fr] opacity-100'
                               : 'grid-rows-[0fr] opacity-0' }
                      grid overflow-hidden transition-all
                      duration-300 ease-in-out`}>
          <div className="flex overflow-hidden">
            <label
              htmlFor={section.id}
              className="group w-12/12 items-center 
                         flex hover:cursor-pointer hover:bg-gray-300">

            {/* Checkbox */}
             
              {mode === "student"
               && (<input
                    type="checkbox"
                    id={section.id}
                    className="w-1/12 hover:cursor-pointer"
                    checked={!!section.seenDate}
                    onChange={ handleSubmit }
                  />)}

            {/* Section's name */}
              <span className={`${section.seenDate ? 'w-8/12' : 'w-10/12'}
                                  ml-2`
                                }>
                {section.name}
              </span>

            {/* Edit & Delete options */}
              { mode === "manage"
                && (<div className="items-center gap-2 flex
                                    *:hidden *:group-hover:block *:text-base
                                    *:hover:underline *:font-medium">
                      <span onClick={() => {setSelSection(section);
                                            handleModalSection();
                                          }}
                          >Edit</span>
                      <span>Delete</span>
                    </div>)}
            {/* Seen at */}
              {section?.seenDate ? (
                  <span className="col-span-4 text-right text-sm 
                                 text-gray-600 ml-4">
                    Seen on {section?.seenDate}
                  </span>) : null}
            </label>
          </div>
        </div>
      ))}
    </>
  )
}

