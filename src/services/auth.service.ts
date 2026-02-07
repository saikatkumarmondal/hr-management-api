import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HrRepository } from '../repositories/hr.repository';

const hrRepo = new HrRepository();

export class AuthService {
  async registerHr(name: string, email: string, pass: string) {
    const hashed = await bcrypt.hash(pass, 10);
    return hrRepo.create({ name, email, password_hash: hashed });
  }

  async login(email: string, pass: string) {
    const user = await hrRepo.findByEmail(email);
    // Security Tip: Generic error message suggests better security practice
    if (!user) throw new Error('Invalid email or password');

    const isValid = await bcrypt.compare(pass, user.password_hash);
    if (!isValid) throw new Error('Invalid email or password');

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' },
    );

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
