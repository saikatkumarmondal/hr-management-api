export interface IEmployee {
  id?: number;
  email?: string;
  name: string;
  age: number;
  designation: string;
  hiring_date: string;
  date_of_birth: string;
  salary: number;
  photo_path?: string;
  deleted_at?: Date | null;
}
