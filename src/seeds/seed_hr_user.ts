import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // remove existing hr
  await knex('hr_users').del();

  // password hash
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Admin and  HR
  await knex('hr_users').insert([
    {
      name: 'Super Admin',
      email: 'admin@hr.com',
      password_hash: hashedPassword,
    },
    {
      name: 'HR Manager',
      email: 'hr@example.com',
      password_hash: hashedPassword,
    },
  ]);

  console.log('✅ Users Seeded Successfully:');
  console.log('1. Admin -> Email: admin@hr.com, Pass: admin123');
  console.log('2. HR    -> Email: hr@example.com, Pass: admin123');
}
