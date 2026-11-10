import useSchool from "../hooks/useSchool";
import { useState, useRef, useEffect } from "react";
import useContent from "../hooks/useContent";



export default function ModalChapter() {

  const { handleModalChapter, validString, selChapter,
          setSelChapter } = useSchool();

  const { useChapterMutation } = useContent();

  const inputRef = useRef(null);

  //Manage Name input's behavior.
  useEffect(() => {
    /*Select all text contained in inputRef 
      when user wants to edit a chapter or focus input 
      if user wants to create a new chapter. */
    inputRef.current?.select();
  }, []);



  const chapterMutation = useChapterMutation({
    onSuccess: () => {
      handleModalChapter();
      setSelChapter([]);
    }
  })



  //State useful to mark Name input in red if name is missing.
  const [ validName, setValidName ] = useState(1);

  //Validate data and run mutation.
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name     = formData.get('name');

    if(validString(name)) {
      setValidName(1);

      const id     = selChapter?.id ?? null;
      const method = id ? "PUT" : "POST";

      //If method === "POST"
      //apply a split to separate each chapter in an array
      //so we can do a multi-insert.
      const chapters = method === "POST"  ? name.split('***')//Remove empty spaces.
                                                .map(chapter => chapter.trim())
                                                .filter(chapter => chapter.length > 0)
                                          : name;

      const data = { id, "name" : chapters,};

      chapterMutation.mutate({"table": "chapters", data, method});
    }else setValidName(0);
  }



  return (
    <>
      <div className="flex m-4">
        <h2 className="text-center w-full text-2xl font-bold">
          { selChapter?.id ? "Edit Chapter" : "New Chapter"}
        </h2>

        <div className="flex justify-end">
          <button className="hover:cursor-pointer"
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



      <form onSubmit={(e) => handleSubmit(e)}
            className="w-11/12 mx-auto"
            onKeyDown={(e) => { if(e.key === 'Enter') handleSubmit(e); }}
      >
        <div className="h-22">
          <b>Chapter name:</b>
          <textarea ref={inputRef}
                 name="name"
                 id="name"
                 defaultValue={selChapter?.name ?? null}
                 className={`${validName ? '' : 'border-2! border-red-500! focus:border-0!' } 
                            textarea-base resize-none`}
          ></textarea>
          { !validName && 
            <p className="text-md text-red-500">Name is required</p> }
        </div>

        <button type="submit"
                className="button-base bg-indigo-500 hover:bg-indigo-600
                           mx-auto! block! mt-10!"
        >
          {chapterMutation.isPending ? "Saving Chapter..." : "Save"}
        </button>
      </form>
    </>
  )
}