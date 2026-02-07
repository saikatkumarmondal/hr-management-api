import { Response } from 'express';
import fs from 'fs';
import path from 'path';

import { IAuthRequest } from '../interfaces/request.interface';
import { sendSuccess, sendError } from '../utils/ApiResponse';
import { employeeSchema } from '../utils/validators';
import { EmployeeService } from '../services/employee.service';

const employeeService = new EmployeeService();

export class EmployeeController {
  async getAll(req: IAuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const data = await employeeService.getEmployees(page, limit, search);
      return sendSuccess(res, 'Employees fetched successfully', data);
    } catch (error) {
      return sendError(res, 'Failed to fetch employees', error);
    }
  }

  async getById(req: IAuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return sendError(res, 'Invalid employee ID', null, 400);

      const employee = await employeeService.getEmployeeById(id);
      if (!employee) return sendError(res, 'Employee not found', null, 404);
      return sendSuccess(res, 'Employee fetched', employee);
    } catch (error) {
      return sendError(res, 'Failed to fetch employee', error);
    }
  }

  async create(req: IAuthRequest, res: Response) {
    try {
      // Ensure body exists
      if (!req.body || typeof req.body !== 'object') {
        console.error('Invalid or empty request body:', req.body);
        return sendError(
          res,
          'Invalid request body (empty or not JSON)',
          null,
          400,
        );
      }

      // Joi Validation
      const { error } = employeeSchema.validate(req.body);
      if (error)
        return sendError(
          res,
          'Validation error',
          error.details[0].message,
          400,
        );

      let photoFilename: string | null = null;

      // Handle photo from form-data (multipart file upload)
      if (req.file) {
        photoFilename = req.file.filename;
      }
      // Handle photo from base64 JSON or URL
      else if (req.body.photo_base64) {
        const photoInput = req.body.photo_base64 as string;

        // Check if it's a URL (starts with http:// or https://)
        if (
          photoInput.startsWith('http://') ||
          photoInput.startsWith('https://')
        ) {
          photoFilename = photoInput; // Store URL directly
        } else {
          // Handle base64 data
          const uploadsDir = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadsDir))
            fs.mkdirSync(uploadsDir, { recursive: true });

          const matches = photoInput.match(/^data:(.+);base64,(.+)$/);
          const base64Data = matches ? matches[2] : photoInput;
          const ext = matches && matches[1] ? matches[1].split('/')[1] : 'jpg';
          const filename = `photo-${Date.now()}.${ext}`;
          const filepath = path.join(uploadsDir, filename);
          fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
          photoFilename = filename;
        }
      }

      // Exclude photo_base64 from database insertion (it's only used to generate photo_path)
      const { photo_base64, ...restBody } = req.body;

      const employeeData = {
        ...restBody,
        photo_path: photoFilename,
      };

      const id = await employeeService.addEmployee(employeeData);
      return sendSuccess(res, 'Employee created successfully', { id });
    } catch (error) {
      console.error('Create employee error:', error);
      return sendError(res, 'Creation failed', error);
    }
  }

  async update(req: IAuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return sendError(res, 'Invalid employee ID', null, 400);

      // Ensure body exists
      if (!req.body || typeof req.body !== 'object') {
        return sendError(
          res,
          'Invalid request body (empty or not JSON)',
          null,
          400,
        );
      }

      // Joi Validation (allow partials on update)
      const { error } = employeeSchema.validate(req.body, {
        presence: 'optional',
      });
      if (error)
        return sendError(
          res,
          'Validation error',
          error.details[0].message,
          400,
        );

      const updateData: any = { ...req.body };

      // Handle photo from form-data (multipart file upload)
      if (req.file) {
        updateData.photo_path = req.file.filename;
      }
      // Handle photo from base64 JSON (optional backup method)
      else if (req.body.photo_base64) {
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir))
          fs.mkdirSync(uploadsDir, { recursive: true });

        const matches = (req.body.photo_base64 as string).match(
          /^data:(.+);base64,(.+)$/,
        );
        const base64Data = matches ? matches[2] : req.body.photo_base64;
        const ext = matches && matches[1] ? matches[1].split('/')[1] : 'jpg';
        const filename = `photo-${Date.now()}.${ext}`;
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
        updateData.photo_path = filename;
      }

      await employeeService.updateEmployee(id, updateData);
      return sendSuccess(res, 'Employee updated successfully');
    } catch (error) {
      console.error('Update employee error:', error);
      return sendError(res, 'Update failed', error);
    }
  }
  async delete(req: IAuthRequest, res: Response) {
    try {
      // Safe cast: make sure we get string
      const idStr = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const id = parseInt(idStr, 10);

      if (isNaN(id)) {
        return sendError(res, 'Invalid employee ID', null, 400);
      }

      await employeeService.removeEmployee(id);
      return sendSuccess(res, 'Employee deleted successfully (Soft Delete)');
    } catch (error) {
      return sendError(res, 'Deletion failed', error);
    }
  }
}
