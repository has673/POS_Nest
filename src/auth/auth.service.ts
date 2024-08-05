import { Injectable } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import  * as dayjs from 'dayjs';


import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class AuthService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  constructor(private readonly datbaseService:DatabaseService){}


  private generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
  

  async signup(CreateAuthDto:Prisma.UserCreateInput) {
    const{email,username,password}= CreateAuthDto
    const existingUser = await this.datbaseService.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error('Email or Username taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = this.generateOtp();
    const otpExpiry = dayjs().add(10, 'minute').toDate();


    const newUser = await this.datbaseService.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        OTP: otp,
        otpExpiry,
      },
    });
    const mailOptions = {
      from: process.env.MAILTRAP_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    await this.transporter.sendMail(mailOptions); 
    return newUser;
 
  }

  async findUnique(email:string){
    const user = await this.datbaseService.user.findUnique({
      where:{
        email
      }
    })
    return user
  }

  async login(CreateAuthDto:Prisma.UserCreateInput) {
    const{email,password}= CreateAuthDto
    
    const user = await this.datbaseService.user.findFirst({
      where: {
        email,     
      },
    });

    if (!user) {
      throw new Error('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token, user };
  }
  async recoverPassword(email: string, password: string) {
    const user = await this.datbaseService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid user');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.datbaseService.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });
  }

  async verifyOtp(email: string, otp: number) {
    const user = await this.datbaseService.user.findUnique({
      where: {
        email,
        OTP: otp,
      },
    });

    if (!user) {
      throw new Error('Invalid OTP');
    }

    const currentTime = dayjs();
    const otpExpiryTime = dayjs(user.otpExpiry);

    if (currentTime.isAfter(otpExpiryTime)) {
      await this.datbaseService.user.update({
        where: { email },
        data: {
          OTP: null,
          verified: true,
          otpExpiry: null,
        },
      });
      throw new Error('OTP has expired');
    }

    await this.datbaseService.user.update({
      where: { email },
      data: {
        OTP: null,
        verified: true,
      },
    });
  }

  async newOtp(email: string) {
    const otp = this.generateOtp();
    const otpExpiry = dayjs().add(10, 'minute').toDate();

    const user = await this.datbaseService.user.update({
      where: { email },
      data: {
        OTP: otp,
        otpExpiry,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    await this.transporter.sendMail(mailOptions);

    return user;
  }
}