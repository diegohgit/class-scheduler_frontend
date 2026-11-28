interface Day {
    id   : number;
    name : string;
}


export interface Class {
  id         : number;
  student_id : number;
  starts     : string;
  ends       : string;
  days       : Day[];
}

//Export utility types for create or update.
export type CreateClassDTO = Omit<Class, "id">;
export type UpdateClassDTO = Partial<CreateClassDTO>;