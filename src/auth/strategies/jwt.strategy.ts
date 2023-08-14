import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ) {

        super({
            //! llave para firmar los tokens
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    //*LOGICA PARA LA AUTORIZACION DEL JWT
    //! Esta funcion validate se ejecuta cuando usamos el @UseGuards()
    async validate( payload: JwtPayload ): Promise<User> {
        
        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });

        if ( !user ) 
            throw new UnauthorizedException('Token not valid')
        //*SI ACTIVO ES FALSE, ENTONCES EL JWT LE NEGARÁ EL ACCESO
        if ( !user.isActive ) 
            throw new UnauthorizedException('User is inactive, talk with an admin');
        // console.log({user});//*para ver el usuario en la consola, siempre pasa por acá

        return user;//! establecemos el usuario en el request
    }

}