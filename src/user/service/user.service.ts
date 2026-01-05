import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignupDto } from '../../auth/dto/user-signup-request.dto';
import * as bcrypt from 'bcrypt';

interface DatabaseError extends Error {
  code: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async signup(userDto: UserSignupDto): Promise<User> {
    const { password, ...userData } = userDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.userRepository.create({
      password: hashedPassword,
      ...userData,
    });
    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      if ((error as DatabaseError).code === '23505') {
        throw new ConflictException(
          'Username, Email, or Phone number already exists'
        );
      }
      throw error;
    }
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });
  }

  async findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }
}
