import { EmployeeRepository } from '../repositories/employee.repository';
import { IEmployee } from '../interfaces/employee.interface';

const employeeRepo = new EmployeeRepository();

export class EmployeeService {
  async getEmployees(page: number, limit: number, search?: string) {
    const { items, total } = await employeeRepo.getAll(page, limit, search);

    const safeLimit = limit > 0 ? limit : 10; // prevent divide by 0

    return {
      items,
      pagination: {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }
  async addEmployee(data: Partial<IEmployee>) {
    return employeeRepo.create(data);
  }

  async removeEmployee(id: number) {
    return employeeRepo.softDelete(id);
  }

  async getEmployeeById(id: number) {
    return employeeRepo.findById(id);
  }

  async updateEmployee(id: number, data: Partial<IEmployee>) {
    return employeeRepo.update(id, data);
  }
}
