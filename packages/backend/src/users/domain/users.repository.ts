import { User } from './user.entity';

export abstract class UsersRepository {
  abstract create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
}
