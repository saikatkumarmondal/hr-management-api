import { Response } from 'express';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { sendSuccess, sendError } from '../utils/ApiResponse';
import { attendanceSchema } from '../utils/validators';
import { IAuthRequest } from '../interfaces/request.interface';

const attendanceRepo = new AttendanceRepository();

export class AttendanceController {
  // POST /attendance (Create or Update)
  async upsert(req: IAuthRequest, res: Response) {
    try {
      // Joi Validation
      const { error, value } = attendanceSchema.validate(req.body);
      if (error) {
        return sendError(
          res,
          'Validation error',
          error.details[0].message,
          400,
        );
      }

      const { employee_id, date, check_in_time } = value;
      await attendanceRepo.upsert({ employee_id, date, check_in_time });
      return sendSuccess(res, 'Attendance recorded successfully', {
        employee_id,
        date,
        check_in_time,
      });
    } catch (error: any) {
      // Handle duplicate attendance constraint
      if (error.code === 'DUPLICATE_ATTENDANCE') {
        return sendError(
          res,
          'Attendance already exists for this employee on this date',
          null,
          409,
        );
      }
      return sendError(res, 'Failed to record attendance', error);
    }
  }

  // GET /attendance (List with pagination & range filter)
  async getAll(req: IAuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        employee_id: req.query.employee_id,
        from: req.query.from,
        to: req.query.to,
      };

      const data = await attendanceRepo.getAll(page, limit, filters);
      return sendSuccess(res, 'Attendance list fetched', data);
    } catch (error) {
      return sendError(res, 'Failed to fetch attendance', error);
    }
  }

  // GET /reports/attendance (Monthly Report)
  async getMonthlyReport(req: IAuthRequest, res: Response) {
    try {
      const { month, employee_id } = req.query;

      console.log('📊 Monthly Report Request:', { month, employee_id });

      // Validate month parameter
      if (!month) {
        return sendError(res, 'Month (YYYY-MM) is required', null, 400);
      }

      // Validate month format (YYYY-MM)
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(month as string)) {
        return sendError(
          res,
          'Invalid month format. Use YYYY-MM (e.g., 2026-02)',
          null,
          400,
        );
      }

      console.log('Fetching report for month:', month);
      const data = await attendanceRepo.getMonthlyReport(
        month as string,
        employee_id ? Number(employee_id) : undefined,
      );

      console.log(
        '✅ Report generated successfully:',
        data.length,
        'employees',
      );

      // Return custom response format for report endpoint
      return res.status(200).json({
        success: true,
        data,
        message: 'Monthly attendance report generated',
      });
    } catch (error: any) {
      console.error('❌ Report generation error:', error);
      return sendError(
        res,
        'Failed to generate report',
        error.message || error,
      );
    }
  }

  // GET /attendance/:id
  async getById(req: IAuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const entry = await attendanceRepo.findById(id);
      if (!entry) return sendError(res, 'Entry not found', null, 404);
      return sendSuccess(res, 'Attendance entry found', entry);
    } catch (error) {
      return sendError(res, 'Error fetching entry', error);
    }
  }

  // PUT /attendance/:id
  async update(req: IAuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return sendError(res, 'Invalid attendance ID', null, 400);

      // Validate update payload (all fields optional)
      const { error, value } = attendanceSchema.validate(req.body, {
        presence: 'optional',
      });
      if (error) {
        return sendError(
          res,
          'Validation error',
          error.details[0].message,
          400,
        );
      }

      await attendanceRepo.update(id, value);
      return sendSuccess(res, 'Attendance updated successfully', value);
    } catch (error: any) {
      // Handle record not found
      if (error.code === 'RECORD_NOT_FOUND') {
        return sendError(res, 'Attendance record not found', null, 404);
      }
      // Handle duplicate attendance constraint
      if (error.code === 'DUPLICATE_ATTENDANCE') {
        return sendError(
          res,
          'Attendance already exists for this employee on this date',
          null,
          409,
        );
      }
      return sendError(res, 'Update failed', error);
    }
  }

  // DELETE /attendance/:id
  async delete(req: IAuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await attendanceRepo.delete(id);
      return sendSuccess(res, 'Attendance entry deleted');
    } catch (error) {
      return sendError(res, 'Deletion failed', error);
    }
  }
}
