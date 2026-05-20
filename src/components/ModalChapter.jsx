import useSchool from "../hooks/useSchool";
import { useState, useRef, useEffect } from "react";
import { useApi } from "../hooks/useApi";

export default function ModalChapter() {

  const { handleModalChapter, validString, selChapter,
          setSelChapter } = useSchool();

  const inputRef = useRef(null);

  //Manage Name input's behavior.
  useEffect(() => {
    /*Select all text contained in inputRef 
      when user wants to edit a chapter or focus input 
      if user wants to create a new chapter. */
    inputRef.current?.select();
  }, []);

  //State useful to mark Name input in red if name is missing.
  const [ validName, setValidName ] = useState(1);
  const { request } = useApi();

  //Async function to send requests to create/update a chapter.
  const handleSubmit = async(e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name     = formData.get('name');

    if(validString(name)) {
      setValidName(1)

      const id = selChapter?.id ?? null;

      const method   = id ? "PUT" : "POST";
      const url      = id ? "/api/chapters/"+id : "/api/chapters";
      const dataName = { "name" : name };
      const message  = id ? "Chapter updated." : "Chapter created.";

      const { success } = await request( method,
                                         url,
                                         dataName,
                                         message );

      //If request is succeded:
      //- Close modal.
      //- Update list of chapters.
      //- Clean state selChapter.
      if(success) {
        handleModalChapter();
        setSelChapter([]);
      }
    }else setValidName(0)
  }

  return (
    <>
      <div className="flex m-4">
        <h2 className="text-center w-full text-2xl font-bold">
          { selChapter?.id ? "Edit Chapter" : "New Chapter"}
        </h2>

        <div className="flex justify-end">
          <button
            className="hover:cursor-pointer"
            onClick={() => {handleModalChapter(); 
                            setSelChapter([]);}}>
            {/* "Close" icon  */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>


      <form onSubmit={handleSubmit}
            className="w-11/12 mx-auto"
      >
        <div className="h-22">
          <b >Chapter name:</b>
          <input  ref={inputRef}
                  name="name"
                  id="name"
                  defaultValue={selChapter?.name ?? null}
                  className={`${validName ? '' : 'border-2! border-red-500! focus:border-0!' } input-base ` }
                  maxLength={150}
                  onKeyDown={(e) => { if(e.key === 'Enter') handleSubmit(); }}
          />
          { !validName && 
            <p className="text-md text-red-500">Name is required</p> }
        </div>
        <div className=" flex mt-2">
          <button
            type="button"
            onClick={() => console.log("Cancel")}
            className="button-base bg-red-500 hover:bg-red-600"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="button-base bg-indigo-500 hover:bg-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  )
}