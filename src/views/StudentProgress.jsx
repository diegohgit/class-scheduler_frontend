import Accordion from "../components/Accordion";
//import { topics } from "../data/topics";
import { student_progress } from "../data/student_progress";
import useSchool from "../hooks/useSchool";
import { useEffect, useState } from "react";

export default function StudentProgress() {


  const { fetchChapters, chapters, } = useSchool();

    useEffect(() =>  {

      fetchChapters();
    }, [])


  // Create a new data structure that combines the topics
  // with the student's progress.
  const progress = chapters.map( (chapter) => ({
    ...chapter,
    section: chapter.section.map( section => {
      const seenAt = student_progress[section.id] ?? null;

      // Return a new section object that includes the "seen" property.
      return {
        ...section,
        seen: Boolean(seenAt),
        seenAt,
      };
    }),
  }));


  return (
  <>
    <h1 className="title-base">Content</h1>

    <div className="w-8/12 p-4 mx-auto bg-gray-200 rounded-lg">
      {progress.map( (chapter) => (
          <Accordion 
            key={chapter.id} 
            mode="student"
            chapter={chapter}
            sections={chapter.section} />
      ))}
    </div>
  </>
  )
}
