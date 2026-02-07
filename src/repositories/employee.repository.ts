import db from '../config/db';
import { IEmployee } from '../interfaces/employee.interface';

export class EmployeeRepository {
  async getAll(page: number, limit: number, search?: string) {
    const offset = (page - 1) * limit;
    let query = db('employees').whereNull('deleted_at');
    if (search) query = query.andWhere('name', 'ILIKE', `%${search}%`);

    const items = await query.clone().limit(limit).offset(offset);
    const [{ count }] = await query.clone().count('id as count');
    return { items, total: Number(count) };
  }

  async findById(id: number) {
    return db('employees').where({ id }).whereNull('deleted_at').first();
  }

  async create(data: Partial<IEmployee>) {
    const result = await db('employees').insert(data).returning('id');
    return result[0].id;
  }

  async update(id: number, data: Partial<IEmployee>) {
    return db('employees').where({ id }).update(data);
  }

  async softDelete(id: number) {
    return db('employees').where({ id }).update({ deleted_at: new Date() });
  }
}
