import { User } from './user.entity';

export abstract class UserRepository {
  abstract create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'passwordHash'>>,
  ): Promise<User>;
}