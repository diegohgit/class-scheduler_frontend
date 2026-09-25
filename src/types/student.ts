export interface Student {
  id:           number;
  first_name:   string;
  last_name:    string|null;
  phone:        string|null;
  email:        string|null;
  birthdate?:   Date|""|null;
  level_id:     string|number;
  level:        {id : string|number; name: string};
  color_id:     string|number;
  progress?:    string|null;
  class_notes?: string|null;
  class_notes_date?: string|null;
}

//Export utility types for create or update.
export type CreateStudentDTO = Omit<Student, "id">;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;