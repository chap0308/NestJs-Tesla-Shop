import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,//*ESTO ES DEL auth.module(ahi dice sobre el tiempo de expiracion, firma, etc) Y DEL JWT
  ) {}


  async create( createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });

      await this.userRepository.save( user )
      delete user.password;//*ya no se ve en la respuesta

      return {
        ...user,
        // token: this.getJwtToken({ email: user.email })
        //*esto es lo que se va a ver en el JWT. Solo va a autenticar por el ID, si cambia el ID entonces no funcionará el JWT
        token: this.getJwtToken({ id: user.id })//*se envia en forma de objeto, ya sea para el email u otro key
      };
      // TODO: Retornar el JWT de acceso

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async login( loginUserDto: LoginUserDto ) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },//*solo busca el email ingresado
      //*select: solo mustra los campos que se quieren ver
      select: { email: true, password: true, id: true } //! OJO!
    });

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid (email)');
      
    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      // token: this.getJwtToken({ email: user.email })
      //*esto es lo que se va a ver en el JWT. Solo va a autenticar por el ID, si cambia el ID entonces no funcionará el JWT
      token: this.getJwtToken({ id: user.id })//*se envia en forma de objeto, ya sea para el email u otro key
    };
  }

  async checkAuthStatus( user: User ){
    //?reinicia el token de acceso cada vez que se ejecuta esta ruta
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }


  
  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBErrors( error: any ): never {


    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }


}
