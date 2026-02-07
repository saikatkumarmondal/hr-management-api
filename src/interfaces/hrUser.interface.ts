export interface IHrUser {
  id?: number;
  email: string;
  password_hash: string;
  name: string;
  created_at?: Date;
}
