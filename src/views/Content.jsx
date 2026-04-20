import Accordion from "../components/Accordion";
import { topics } from "../data/topics";
import Modal from 'react-modal'
import useSchool from "../hooks/useSchool";
import ModalChapter from "../components/ModalChapter";

export default function Content() {


  const { handleModalChapter, modalChapter, setModalChapter } = useSchool();

  return (
	<>
    <h1 className="title-base">Content</h1>

    <div className="w-8/12 p-4 mb-10 mx-auto bg-gray-200 rounded-lg">
      {topics.map( (topic) => (
          <Accordion 
            key={topic.id} 
            mode="manage"
            title={topic.title}
            subtopics={topic.subtopics}/>
      ))}
    </div>
        <div className={`w-full  fixed bottom-0 left-0 
                         bg-white `}>
          <div className="flex items-center justify-center">
          <button 
            type="button"
            onClick={handleModalChapter}
            className="button-base flex items-center 
                       justify-center bg-indigo-500 hover:bg-indigo-600"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p>Add Chapter</p>
          </button>
          <button 
            type="button"
            className="button-base flex items-center 
                       justify-center bg-indigo-500 hover:bg-indigo-600"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="size-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
 
            <p>Add Section</p>
          </button>
        </div>
        </div>

      <Modal isOpen={modalChapter} className="modal-base w-95 h-55">
          <ModalChapter />
      </Modal>
  </>
  )
}
