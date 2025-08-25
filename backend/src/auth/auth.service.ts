import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // Real login
  async login(dto: { email: string; password: string }) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }


    if (!await bcrypt.compare(dto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }


  async register(dto: { name: string; email: string; password: string }) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new UnauthorizedException('Email already exists');

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    await this.userRepo.save(user);

    const payload = { sub: user.id, email: user.email };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
