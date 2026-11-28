export interface Day {
  id    : number;
  label : string;
}


export interface Class {
  id         : number;
  student_id : number;
  first_name : string;
  last_name  : string;
  starts     : string;
  ends       : string;
  color      : string;
  days       : Day[];
  delete_id  : number|null;
}

//Export utility types for create or update.
export type CreateClassDTO = Omit<Class, "id">;
export type UpdateClassDTO = Partial<CreateClassDTO>;