export interface Student {
  id: number;
  name: string;
  birthdate?: Date | "" | null;
  level_id: string | number;
  color_id: string | number;
  homework?: string | null;
  progress?: string | null;
}

//Export utility types for create or update.
export type CreateStudentDTO = Omit<Student, "id">;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;