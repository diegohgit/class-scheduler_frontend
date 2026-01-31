import Accordion from "../components/Accordion";
import { topics } from "../data/topics";

export default function Topics() {
  return (
	<>
    <h1 className="text-center font-bold text-4xl my-4">Topics</h1>

    <div className="w-8/12 p-4 mx-auto bg-gray-200 rounded-lg">
      {topics.map( (topic) => (
          <Accordion 
            key={topic.id} 
            mode="manage"
            title={topic.title}
            subtopics={topic.subtopics} />
      ))}
    </div>
  </>
  )
}
