import {
  Injectable,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import * as dayjs from 'dayjs';
// import { AwsConfigService } from '../../aws-config/aws-config.service';
import { DatabaseService } from 'src/database/database.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Express } from 'express';
import { S3Service } from 'src/s3/s3.service';

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

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  // Temporary method for file upload
  // async uploadFile(file: Express.Multer.File): Promise<string> {
  //   // Simulating local file storage
  //   const filePath = `./uploads/${file.originalname}`;
  //   // Ensure the uploads directory exists
  //   // Save file to local storage
  //   require('fs').writeFileSync(filePath, file.buffer);
  //   return filePath; // Returning local file path
  // }

  private generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async signup(createAuthDto: Prisma.UserCreateInput): Promise<User> {
    const { email, username, password } = createAuthDto;

    const existingUser = await this.databaseService.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email or Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = this.generateOtp();
    const otpExpiry = dayjs().add(10, 'minute').toDate();

    const newUser = await this.databaseService.user.create({
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

  async findUnique(email: string): Promise<User | null> {
    return await this.databaseService.user.findUnique({ where: { email } });
  }

  async login(
    createAuthDto: Prisma.UserCreateInput,
  ): Promise<{ token: string }> {
    const { email, password } = createAuthDto;

    const user = await this.databaseService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid username or password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return { token };
  }

  async recoverPassword(
    email: string,
    password: string,
  ): Promise<{ email: string; username: string }> {
    const user = await this.databaseService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid user');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await this.databaseService.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return updated;
  }

  async verifyOtp(email: string, otp: number): Promise<void> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user || user.OTP !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const currentTime = dayjs();
    const otpExpiryTime = dayjs(user.otpExpiry);

    if (currentTime.isAfter(otpExpiryTime)) {
      await this.databaseService.user.update({
        where: { email },
        data: {
          OTP: null,
          verified: true,
          otpExpiry: null,
        },
      });
      throw new BadRequestException('OTP has expired');
    }

    await this.databaseService.user.update({
      where: { email },
      data: {
        OTP: null,
        verified: true,
      },
    });
  }

  async newOtp(email: string): Promise<User> {
    const otp = this.generateOtp();
    const otpExpiry = dayjs().add(10, 'minute').toDate();

    const user = await this.databaseService.user.update({
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

  async getProfile(id: number): Promise<User> {
    const user = await this.databaseService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, file?: Express.Multer.File): Promise<User> {
    // Find the user by ID
    const user = await this.databaseService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (file) {
      // Generate a unique key for the S3 bucket
      const bucketKey = `${file.fieldname}-${Date.now()}`;

      // Upload the file to S3 and get the file URL
      const fileUrl = await this.s3Service.uploadFile(file, bucketKey);

      // Update the user's profile picture with the file URL
      const updatedUser = await this.databaseService.user.update({
        where: { id }, // Specify the user to update
        data: {
          profilePicture: fileUrl, // Update the profile picture with the S3 URL
        },
      });

      return updatedUser; // Return the updated user
    }

    throw new BadRequestException('No file provided');
  }

  async updateProfile(id: number, updateAuthDto: UpdateAuthDto) {
    // Find the user by ID
    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.databaseService.user.update({
      where: { id }, // Specify the user to update
      data: {
        ...updateAuthDto,
      },
    });
    return updatedUser;
  }

  async createUser(createUserDto: CreateUserDto) {}
}
