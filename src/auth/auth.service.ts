import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './DTO/sign-up.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './DTO/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    console.log('JWT_SECRET:', this.configService.get('JWT_SECRET'));
  }

  async signUp(signUpDto: SignUpDto) {
    const existUser = await this.usersService.findOneByEmail(signUpDto.email);
    if (existUser) throw new BadRequestException('User already exists');

    const hashedPass = await bcrypt.hash(signUpDto.password, 10);
    await this.usersService.createUser({ ...signUpDto, password: hashedPass });
    return 'user created successfully';
  }

  async signIn(signInDto: SignInDto) {
    const existUser = await this.usersService.findOneByEmail(signInDto.email);
    if (!existUser)
      throw new BadRequestException('Email or password is not correct');
    const isPassEqual = await bcrypt.compare(
      signInDto.password,
      existUser.password,
    );
    if (!isPassEqual)
      throw new BadRequestException('Email or password is not correct');
    const payload = {
      userId: existUser._id,
    };
    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    return { accessToken };
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    return user;
  }
}
