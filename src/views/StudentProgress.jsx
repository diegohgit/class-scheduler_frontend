import Accordion from "../components/Accordion";
import useSchool from "../hooks/useSchool";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import dayjs from "dayjs";
import { useContent, useStudentProgress } from "../hooks/useContent";

export default function StudentProgress() {

  const {id} = useParams();
  const navigate = useNavigate();

  //Fetch all chapters.
  const { data:chapters = [],
          isLoading: isLoadingChapters,
          isError: isErrorChapters,
        } = useContent();

  //Fetch only chapters seen by a single student.
  const { data:studentProgress = [],
          isLoading: isLoadingProgress,
          isError:   isErrorProgress,
        } = useStudentProgress(id);


  // Create a new data structure that combines all sections
  // with the student's progress.
  const progress = chapters.map( (chapter) => ({
    ...chapter,
    section: chapter.section.map( (section) => {
      const sp = studentProgress.find(
        (sp) => sp.section_id === section.id
      );

      //const seenAt = studentProgress[section.id] ?? null;
      const seenDate = sp ? dayjs(sp.seen_date).format("DD/MMM/YYYY") : null;

      //Return a new section object that includes the "seenDate" property.
      return { ...section, seenDate, };
    }),
  }));


  return (
  <>
    <h1 className="title-base">Content</h1>

    <div className="w-8/12 p-4 mb-10
                    mx-auto bg-gray-200 rounded-lg">
      { isLoadingProgress || isLoadingChapters 
        ? (<span>Fetching progress...</span>) : null}

      { isErrorProgress || isErrorChapters 
        ? (<span>Couldn't fetch progress.</span>)
        : (progress?.length > 0
           && progress.map( (chapter) => (
              <Accordion 
                key={chapter.id} 
                mode="student"
                chapter={chapter}
                sections={chapter.section} />
              ))
          )
      }
    </div>

    <div className="bottom-bar">
      <button type="button"
              className="button-base bg-blue-500 hover:bg-blue-600"
              onClick={() => {navigate("/students");}}
      >
        Back to list
      </button>

      <button type="button"
              className="button-base bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate("/students/"+id)}
      >
        Back to student
      </button>
    </div>
  </>
  )
}
