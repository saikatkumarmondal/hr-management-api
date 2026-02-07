import db from "../config/db";
import { IHrUser } from "../interfaces/hrUser.interface";

export class HrRepository {
  async findByEmail(email: string): Promise<IHrUser | undefined> {
    return db("hr_users").where({ email }).first();
  }

  async create(data: IHrUser): Promise<IHrUser> {
    const [user] = await db("hr_users").insert(data).returning("*");
    return user;
  }
}
