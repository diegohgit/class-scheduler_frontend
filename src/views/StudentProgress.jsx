import Accordion from "../components/Accordion";
import { topics } from "../data/topics";
import { student_progress } from "../data/student_progress";

export default function StudentProgress() {

  // Create a new data structure that combines the topics
  // with the student's progress.
  const progress = topics.map( (topic) => ({
    ...topic,
    subtopics: topic.subtopics.map( subtopic => {
      const seenAt = student_progress[subtopic.id] ?? null;

      // Return a new subtopic object that includes the "seen" property.
      return {
        ...subtopic,
        seen: Boolean(seenAt),
        seenAt,
      };
    }),
  }));

  return (
  <>
    <h1 className="title-base">Topics</h1>

    <div className="w-8/12 p-4 mx-auto bg-gray-200 rounded-lg">
      {progress.map( (topic) => (
          <Accordion 
            key={topic.id} 
            mode="student"
            title={topic.title}
            subtopics={topic.subtopics} />
      ))}
    </div>
  </>
  )
}
