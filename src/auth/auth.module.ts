import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy ],//* COLOCAR COMO PROVIDER EL JWT, ya que lo creamos manualmente. Es el mismo nombre de la clase creada en el archivo strategies
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([ User ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    //! JWT: Dice como firma, autentica y como verifica los tokens
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        // console.log('JWT Secret', configService.get('JWT_SECRET') )
        // console.log('JWT SECRET', process.env.JWT_SECRET)
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn:'2h'
          }
        }
      }
    })
    // JwtModule.register({
      // secret: process.env.JWT_SECRET,
      // signOptions: {
      //   expiresIn:'2h'
      // }
    // })

  ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]//?exportamos lo necesario para usar en otros lugares como PassportModule y JwtStrategy
})
export class AuthModule {}
