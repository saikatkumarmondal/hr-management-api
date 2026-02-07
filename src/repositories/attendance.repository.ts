import db from '../config/db';
import { IAttendance } from '../interfaces/attendance.interface';

export class AttendanceRepository {
  async upsert(data: IAttendance) {
    // Check if record already exists for this employee on this date
    const existing = await db('attendance')
      .where({ employee_id: data.employee_id, date: data.date })
      .first();

    if (existing) {
      const error = new Error('Duplicate attendance record');
      (error as any).code = 'DUPLICATE_ATTENDANCE';
      throw error;
    }

    // Insert new record if it doesn't exist
    return db('attendance').insert(data);
  }

  async findById(id: number) {
    return db('attendance').where({ id }).first();
  }

  async update(id: number, data: Partial<IAttendance>) {
    // Get current record
    const currentRecord = await db('attendance').where({ id }).first();
    if (!currentRecord) {
      const error = new Error('Attendance record not found');
      (error as any).code = 'RECORD_NOT_FOUND';
      throw error;
    }

    // If employee_id or date is being changed, check for unique constraint
    if (data.employee_id || data.date) {
      const newEmployeeId = data.employee_id || currentRecord.employee_id;
      const newDate = data.date || currentRecord.date;

      // Check if another record already exists with the new (employee_id, date) combination
      const existing = await db('attendance')
        .where({ employee_id: newEmployeeId, date: newDate })
        .whereNot({ id })
        .first();

      if (existing) {
        const error = new Error('Duplicate attendance record');
        (error as any).code = 'DUPLICATE_ATTENDANCE';
        throw error;
      }
    }

    return db('attendance').where({ id }).update(data);
  }

  async delete(id: number) {
    return db('attendance').where({ id }).del();
  }

  async getAll(page: number, limit: number, filters: any) {
    const offset = (page - 1) * limit;
    let query = db('attendance');
    if (filters.employee_id) query.where('employee_id', filters.employee_id);
    if (filters.from && filters.to)
      query.whereBetween('date', [filters.from, filters.to]);

    const items = await query.clone().limit(limit).offset(offset);
    const [{ count }] = await query.clone().count('id as count');
    return { items, total: Number(count) };
  }

  async getMonthlyReport(month: string, employee_id?: number) {
    try {
      console.log('🔍 Building monthly report query for:', {
        month,
        employee_id,
      });

      // Build the query with proper date formatting
      let query = db('employees as e')
        .select(
          'e.id as employee_id',
          'e.name',
          db.raw(
            'COUNT(CASE WHEN a.id IS NOT NULL THEN 1 END)::integer as days_present',
          ),
          db.raw(
            "COUNT(CASE WHEN a.check_in_time > '09:45:00' THEN 1 END)::integer as times_late",
          ),
        )
        .leftJoin('attendance as a', function () {
          this.on('e.id', '=', 'a.employee_id').andOn(
            db.raw("DATE_TRUNC('month', a.date)::date = ?::date", [
              month + '-01',
            ]),
          );
        })
        .whereNull('e.deleted_at')
        .groupBy('e.id', 'e.name')
        .orderBy('e.id');

      if (employee_id) {
        query.where('e.id', employee_id);
      }

      console.log('Executing query:', query.toString());
      const result = await query;
      console.log('✅ Query executed successfully, rows:', result.length);
      return result;
    } catch (error: any) {
      console.error('❌ Query error:', error.message);
      throw error;
    }
  }
}
