export class User {
  id!: string;
  email!: string;
  name?: string;
  passwordHash!: string;
  avatarPath?: string;
  createdAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
