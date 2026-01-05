import { Expose } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  fullName: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  role: string;

  @Expose()
  location: { type: string; coordinates: number[] };

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.phoneNumber = user.phoneNumber;
    this.role = user.role;
    this.location = user.location;
    this.fullName = `${user.firstName} ${user.lastName}`;
  }
}
