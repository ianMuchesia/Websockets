import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IRequestWithUser } from 'src/common/interfaces/http.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshTokenAuthGuard } from './guards/jwt-refresh-token.guard';



@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    public async register(@Body() registerDto: RegisterUserDto)
    {
        return await this.authService.register(registerDto)
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    public async login(@Req() req: IRequestWithUser)
    {

        const { user } = req
        const payload = {
            userId: user.id,
            email: user.email,
        }


        const { accessCookieToken, refreshTokenCookie} = await this.authService.assignCookies(user,payload)

        this.authService.setHeaderArray(req.res ,[accessCookieToken,refreshTokenCookie])

        return {
            message:"Success",
            responseEntity: user
        }

        
    }


    @Post('logout')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async logout(@Req() req: IRequestWithUser)
    {
        await this.authService.removeRefreshToken(req.res, req.user)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    public getAuthenticatedUser(@Req() req: IRequestWithUser) {
       
      return {
        message: 'Success',
        responseEntity: req.user,
      };
      
    }

    @Get('refresh')
    @UseGuards(JwtRefreshTokenAuthGuard)
    public refresh(@Req() req: IRequestWithUser)
    {
        return this.authService.refreshToken(req.res, req.user)
    }
}
