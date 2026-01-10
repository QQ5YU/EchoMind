export class User {
  id!: string;
  email!: string;
  passwordHash!: string;
  createdAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
