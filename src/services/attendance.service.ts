import { AttendanceRepository } from '../repositories/attendance.repository';
import { IAttendance } from '../interfaces/attendance.interface';

const attendanceRepo = new AttendanceRepository();

export class AttendanceService {
  async recordAttendance(data: IAttendance) {
    return await attendanceRepo.upsert(data);
  }

  async getAttendanceLogs(page: number, limit: number, filters: any) {
    return await attendanceRepo.getAll(page, limit, filters);
  }

  async generateMonthlyReport(month: string, employeeId?: number) {
    return await attendanceRepo.getMonthlyReport(month, employeeId);
  }
}
