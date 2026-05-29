import useSchool from "../hooks/useSchool";
import { useState, useRef, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useContent } from "../hooks/useContent"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ModalSection() {

  const { validString, selSection, setSelSection,
          handleModalSection, } = useSchool();

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



  const { request } = useApi();
  
  //Async function to send requests to create/update a section.
  const handleRequest = async(sectionData) => {

    const id = selSection?.id ?? null;

    const method  = id ? "PUT" : "POST";
    const url     = id ? "/api/sections/"+id : "/api/sections";
    const message = id ? "Section updated." : "Section created.";

    const { success } = await request( method,
                                        url,
                                        sectionData,
                                        message );
    return success
  }



  const queryClient = useQueryClient();

  const sectionMutation = useMutation({
    mutationFn: (sectionData) => handleRequest(sectionData),
    onSuccess: async (success) =>{
      if(success){
        await queryClient.refetchQueries({queryKey:["chapters"]})
        handleModalSection();
        setSelSection([]);
      }
    }
  });



  const [ validName, setValidName ] = useState(1);

  //Validate data and run mutation.
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData   = new FormData(e.currentTarget);
    const chapter_id = formData.get('chapter_id');
    const section    = formData.get('name');

    if(validString(section)){
      setValidName(1);

      const sectionData = { "chapter_id" : chapter_id, "name" : section };
      sectionMutation.mutate(sectionData);
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
          <input ref={inputRef}
                name="name"
                id="name"
                defaultValue={selSection?.name ?? null}
                className={`${validName ? '' : 'border-2! border-red-500! focus:border-0!' } input-base ` }
                maxLength={150}                
          />
          { !validName &&
            <p className="text-md text-red-500">Section field is required.</p>}
        </div>

        <div className=" flex ">
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