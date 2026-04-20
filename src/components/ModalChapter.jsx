import useSchool from "../hooks/useSchool";

export default function ModalChapter() {

  const { handleModalChapter } = useSchool();

  return (
    <>
      <div className="flex m-4">
        <h2 className="text-center w-full text-2xl font-bold">New Chapter</h2>
        <div className="flex justify-end">
          <button
            className="hover:cursor-pointer"
            onClick={handleModalChapter}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
              viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <form 
            className="w-11/12 mx-auto"
      >
        <b >Chapter name:</b>
        <input name="" 
                  id=""
                  className="input-base"
                  >
        </input>
        <div className=" flex mt-2">
          <button
            type="button"
            onClick={() => console.log(selStudent)}
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