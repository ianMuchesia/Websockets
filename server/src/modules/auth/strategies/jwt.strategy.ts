import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/modules/user/user.service";
import { IPayloadJwt } from "../auth.interface";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        private readonly userService: UserService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req:Request) => {
                    return req?.cookies?.Authorization;
                    },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        })
    }


    public async validate(payload: IPayloadJwt)
    {
        const user = await this.userService.getUserByEmail(payload.email);

        return user;
    }


}