import { useState } from "react"; 

export default function Accordion({mode, chapter, sections}) {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="group p-2  hover:cursor-pointer text-lg font-bold flex
                       justify-between w-full bg-gray-200 hover:bg-gray-300"
           onClick={() => setIsOpen(!isOpen)}
        >
        <span className="text-lg font-bold">{chapter}</span>
        <div className="flex items-center gap-2">
          <span className="hidden group-hover:block hover:underline 
                           text-base font-medium">Edit</span>
          <span className="hidden group-hover:block hover:underline
                           text-base font-medium">Delete</span>
          {isOpen ? <span className="">-</span> : <span>+</span>}
        </div>
      </div>

      {sections?.map( (section) => (
        <div
          key={section.id}
          className={`${isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0' }
                      grid overflow-hidden transition-all
                      duration-300 ease-in-out`}
        >
          <div className="flex overflow-hidden">
            <label
              htmlFor={section.id}
              className="w-full grid grid-cols-12 items-center 
                          hover:cursor-pointer hover:bg-gray-300">
              <input
                type="checkbox"
                id={section.id}
                className={`${mode === "manage" ? 'hidden' : 'mr-2' } col-span-1 `}
                defaultChecked={Boolean(section.seenAt)}
                />
              <span className={`${!section.seenAt ? 'col-span-11' : 'col-span-7' }`}>
                {section.subtitle}
              </span>
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

