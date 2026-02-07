export interface IAttendance {
  id?: number;
  employee_id: number;
  date: string; // YYYY-MM-DD
  check_in_time: string; // HH:mm:ss
  created_at?: Date;
}

export interface IMonthlyReport {
  employee_id: number;
  name: string;
  days_present: number;
  times_late: number;
}
