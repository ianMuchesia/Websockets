import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { IPayloadJwt } from './auth.interface';
import { User } from '../user/user.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ){}

    public async register(registerDto: RegisterUserDto)
    {
        const userExist = await this.userService.getUserByEmail(registerDto.email);


        if (userExist){
            throw new ConflictException( `User with email ${registerDto.email} already exists`,   )
        }

     

        const hashedPassword = await this.hashPassword(registerDto.password)


        try {
            const user = await this.userService.create({
                ...registerDto,
                password: hashedPassword
            });

            return {
                message:"Success",
                responseEntity: user
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    public async assignCookies(user:User,payload:IPayloadJwt)
    {
        const token = this.jwtService.sign(payload);

        const accessCookieToken = `Authorization=${token};HttpOnly;Path=/;Max-Age=${process.env.JWT_EXPIRATION_TIME}`;


        const refreshToken = this.jwtService.sign(payload,{
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        })

        const refreshCookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;

        await this.setCurrentRefreshToken(user,payload.userId)


        return {
            accessCookieToken,
            refreshToken,
        }
        



    
    }

    public setHeaderSingle(res: Response, cookie: string): void {
        res.setHeader('Set-Cookie', cookie);
      }
      public setHeaderArray(res: Response, cookies: string[]): void {
        res.setHeader('Set-Cookie', cookies);
      }
    

    public async setCurrentRefreshToken(user:User,refreshToken: string)
    {

        const currentHashedRefreshToken = await this.hashPassword(refreshToken)

        await this.userService.saveToken(user,currentHashedRefreshToken)
    }


    public async hashPassword(password:string)
    {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        return hashedPassword
    }
}
