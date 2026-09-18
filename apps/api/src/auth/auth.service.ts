import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; import * as bcrypt from 'bcrypt'; import { UsersService } from '../users/users.service'; import { LoginDto, RegisterDto } from './auth.dto';
@Injectable() export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}
  async register(dto: RegisterDto) { if(await this.users.findByEmail(dto.email)) throw new ConflictException('Email already registered'); const user=await this.users.create({name:dto.name,email:dto.email,passwordHash:await bcrypt.hash(dto.password,12)}); return this.token(user); }
  async login(dto: LoginDto) { const user=await this.users.findByEmail(dto.email); if(!user || !(await bcrypt.compare(dto.password,user.passwordHash))) throw new UnauthorizedException('Invalid credentials'); return this.token(user); }
  private token(user:{id:number;name:string;email:string}) { return { accessToken:this.jwt.sign({sub:user.id,email:user.email}), user:{id:user.id,name:user.name,email:user.email} }; }
}
