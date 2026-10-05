import Accordion from "../components/Accordion";
import Modal from 'react-modal'
import useSchool from "../hooks/useSchool";
import ModalChapter from "../components/ModalChapter";
import ModalSection from "../components/ModalSection";
import useContent from "../hooks/useContent";



export default function Content() {

  const { handleModalChapter, modalChapter, setModalChapter,
          modalSection, setModalSection, handleModalSection,
          setSelSection, setSelChapter } = useSchool();

  const { useChapters } = useContent();


  const { data: chapters = [],
          isLoading,
        } = useChapters();


  return (
	<>
    <h1 className="title-base">Content</h1>

    <div className="w-8/12 p-4 mb-10
                    mx-auto bg-gray-200 rounded-lg">
      {chapters?.length ? (
        chapters.map( (chapter) => (
          <Accordion 
            key={chapter.id} 
            mode="manage"
            chapter={chapter}
            sections={chapter.section}/>
          ))
        ) : isLoading ? (<span>Fetching chapters...</span>) 
                      : (<span>No chapters available.</span>)}
    </div>


    <div className="bottom-bar">
      <button type="button"
              onClick={() => {handleModalChapter();
                              setSelChapter([]);}}
              className="button-base flex items-center 
                         justify-center bg-indigo-500 hover:bg-indigo-600"
      >
        {/* "Plus" icon  */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

        <span>Add chapter</span>
      </button>

      <button type="button"
              onClick={() => {handleModalSection();
                              setSelSection([]);}}
              className="button-base flex items-center 
                         justify-center bg-indigo-500 hover:bg-indigo-600"
      >
        {/* "Plus" icon  */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>

        <span>Add section</span>
      </button>
    </div>

      <Modal isOpen={modalChapter} className="modal-base w-95 h-65">
          <ModalChapter />
      </Modal>

      <Modal isOpen={modalSection} className="modal-base w-95 h-80">
          <ModalSection />
      </Modal>
  </>
  )
}
