import { useState } from "react";
import { useParams } from "react-router-dom";
import useSchool from "../hooks/useSchool";
import { useApi } from "../hooks/useApi";

export default function Accordion({mode, chapter, sections}) {

  const [isOpen, setIsOpen] = useState(false);

  const { handleModalChapter, setSelChapter, setSelSection,
          handleModalSection } = useSchool();

  const { request } = useApi();

  const { id } = useParams();
  const handleCheck = async (e) => {

    const section_id = e.target.id;

    if(id && section_id){
      const url = "api/students/"+id+"/progress";
      const data = { "student_id" : id, "section_id" : section_id};

      const { success } = await request("POST",
                                        url,
                                        data,
                                        "Section marked as seen.");

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
          <div className={`${mode === "manage" ? 'group-hover:block' : 'hidden'}
                          hidden text-base font-medium 
                          
                          *:ml-2 *:hover:underline`}>

            <span onClick={() => {setSelChapter(chapter);
                                  handleModalChapter();}}
                 >Edit</span>

            <span>Delete</span>
          </div>
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
              className="group w-12/12 items-center  flex border border-amber-200
                         hover:cursor-pointer hover:bg-gray-300">

            {/* Checkbox */}
              <input
                type="checkbox"
                id={section.id}
                className={`${mode === "manage" ? 'hidden' : '' } 1/12 hover:cursor-pointer`}
                defaultChecked={Boolean(section.seenAt)}
                onChange={handleCheck }
              />

            {/* Section's name */}
              <span className={`${section.seenAt ? 'w-8/12' : 'w-10/12'}
                                  ml-2
                                  border border-r-amber-600`
                                }>
                {section.name}
              </span>

            {/* Edit & Delete options */}
              <div className={`${mode === "manage" ? '' : 'hidden'}
                                 items-center gap-2 flex
                                *:hidden *:group-hover:block *:text-base
                                *:hover:underline *:font-medium`}>
                <span onClick={() => {setSelSection(section);
                                      handleModalSection();
                                    }}
                     >Edit</span>
                <span>Delete</span>
              </div>

            {/* Seen at */}
              <span className={`${!section.seenAt ? 'hidden' : '' } 
                               col-span-4 text-right text-sm text-gray-600 ml-4`}>
                Seen at {section.seenAt}
              </span>
            </label>
          </div>
        </div>
      ))}
    </>
  )
}

