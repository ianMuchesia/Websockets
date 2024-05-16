import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express';
import { AuthService } from "../auth.service";
import { IPayloadJwt } from "../auth.interface";



@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token'
){

    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.Refresh;
                }
            ]),
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    public async validate(request: Request, payload: IPayloadJwt){
        const refreshToken = request.cookies?.Refresh;
        const userId = payload.userId;

        return this.authService.getUserIfRefreshTokenMatches(
            refreshToken,
            userId,
        );
    }
}