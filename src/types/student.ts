export interface Student {
  id:           number;
  name:         string;
  phone:        string|null;
  email:        string|null;
  birthdate?:   Date|""|null;
  level_id:     string|number;
  color_id:     string|number;
  progress?:    string|null;
  class_notes?: string|null;
  class_notes_date?: string|null;
}

//Export utility types for create or update.
export type CreateStudentDTO = Omit<Student, "id">;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;