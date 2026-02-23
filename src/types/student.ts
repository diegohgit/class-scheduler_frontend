export interface Student {
  id: number;
  name: string;
  birthdate?: number | null;
  level: number;
  color: string;
  homework?: string | null;
  progress?: string | null;
}

export type CreateStudentDTO = Omit<Student, "id">;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;