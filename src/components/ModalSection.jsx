import useSchool from "../hooks/useSchool";
import { useState, useRef, useEffect } from "react";
import useContent from "../hooks/useContent";



export default function ModalSection() {

  const { validString, selSection, setSelSection,
          handleModalSection, } = useSchool();

  const { useSectionMutation } = useContent();

  const inputRef = useRef(null);

  //load list of chapters
  const { data:chapters = [],
          isLoading,
        } = useContent();



  //Manage Name input's behavior.
  useEffect(() => {
    /*Select all text contained in inputRef 
      when user wants to edit a chapter or focus input 
      if user wants to create a new chapter. */
    inputRef.current?.select();
  }, []);

  

  //Mutation to create/update sections.
  const sectionMutation = useSectionMutation({
    onSuccess: () => {
      handleModalSection();
      setSelSection([]);
    }
  });



  const [ validName, setValidName ] = useState(1);

  //Validate data and run mutation.
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData   = new FormData(e.currentTarget);
    const chapter_id = formData.get('chapter_id');
    const name       = formData.get('name');

    if(validString(name)){
      setValidName(1);

      const id     = selSection?.id ?? null;
      const method = id ? "PUT" : "POST";

      //If method === "POST"
      //apply a split to separate each section in an array
      //so we can do a multi-insert.
      const sections = method === "POST"  ? name.split('***')//Remove empty spaces.
                                                .map(section => section.trim())
                                                .filter(section => section.length > 0)
                                          : name;
      const data = {id,
                    chapter_id,
                    "name" : sections,};

      sectionMutation.mutate({"table": "sections", data, method});
    }
    else setValidName(0);
  }



  return (
    <>
      <div className="flex m-4">
        <h2 className="text-center w-full text-2xl font-bold">
          { selSection?.id ? "Edit Section" : "New Section"}
        </h2>

        {/* Close button */}
        <div className="flex justify-end">
          <button
            className="hover:cursor-pointer"
            onClick={() => {handleModalSection(); 
                            setSelSection([]);}}>
            {/* "Close" icon  */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>


      <form onSubmit={handleSubmit}
            className="w-11/12 mx-auto">
        <div className="block mb-2">
          <b>Chapter:</b>
          <select className="input-base focus:border-2!"
                  name="chapter_id"
                  id="chapter_id"
                  onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.form?.requestSubmit();
                              }
                            }}
                  defaultValue={selSection?.chapter_id}>
            {chapters?.map((chapter) =>
              <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
            )}
          </select>
        </div>

        <div className="h-22">
          <b>Section name:</b>
          <textarea ref={inputRef}
                 name="name"
                 id="name"
                 defaultValue={selSection?.name ?? null}
                 className={`${validName ? '' : 'border-2! border-red-500! focus:border-0!' } 
                            textarea-base resize-none`}
          ></textarea>
          { !validName &&
            <p className="text-md text-red-500">Section field is required.</p>}
        </div>

        <div className="flex mt-10">
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
            {sectionMutation.isPending ? "Saving Section..." : "Save"}
          </button>
        </div>
      </form>
    </>
  )
}