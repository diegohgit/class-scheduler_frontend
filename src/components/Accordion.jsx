import { useState } from "react"; 

export default function Accordion({mode, title, subtopics}) {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className=" py-2 hover:cursor-pointer text-lg font-bold flex
                    justify-between w-full bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
        >
        <span>{title}</span>
        {isOpen ? <span>-</span> : <span>+</span>}
      </div>

      {subtopics.map( (subtopics) => (
        <div
          key={subtopics.id}
          className={`${isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0' }
                      grid overflow-hidden transition-all
                      duration-300 ease-in-out`}
        >
          <div className="flex overflow-hidden">
            <label
              htmlFor={subtopics.id}
              className="w-full grid grid-cols-12 items-center 
                          hover:cursor-pointer hover:bg-gray-300">
              <input
                type="checkbox"
                id={subtopics.id}
                className={`${mode === "manage" ? 'hidden' : 'mr-2' } col-span-1 `}
                defaultChecked={Boolean(subtopics.seenAt)}
                />
              <span className={`${!subtopics.seenAt ? 'col-span-11' : 'col-span-7' }`}>
                {subtopics.subtitle}
              </span>
              <span className={`${!subtopics.seenAt ? 'hidden' : '' } 
                               col-span-4 text-right text-sm text-gray-600 ml-4`}>
                Seen at {subtopics.seenAt}
              </span>
            </label>
          </div>
        </div>
      ))}
    </>
  )
}

