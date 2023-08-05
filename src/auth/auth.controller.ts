import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { RawHeaders, GetUser, Auth } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')//?esto es para la documentacion
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //*END POINTS:

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto ) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }
  //?Como sabemos, solo podemos obtener el jwt al momento del registro y del login. Pero si necesitamos otra rutas que necesiten el jwt, podemos usar el siguiente end-point
  //*basicamente es para usarlo en todas las rutas que necesiten autenticacion, ya que, necesitamos la validacion del jwt en esas rutas. Además esto reiniciará el token y alargará el tiempo del mismo. 
  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user );
  }

  //*Seccion 13 - 175: Rutas privadas
  //*solo se pueden entrar a estas rutas con el JWT en postman
  @Get('private')//? localhost:3000/api/auth/private y luego en postman: Authorization: "Bearer token" y colocar el token que se genera usando POST de la funcion login o create
  //*GUARD: Usados para permitir o prevenir acceso a una ruta.
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,//*user es lo que retorna en el decorador y lo que está adentro como parametro es la "data". La data se puede ver en el decorador
    @GetUser('email') userEmail: string,
    // @GetUser(['email','role','fullName']) user: string,//*seccion 13 - 177, para enviar varios parametros en la data, usamos un arreglo
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {

    //*Solo retornará si el JWT es valido por el ID
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }


  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @RoleProtected( ValidRoles.superUser, ValidRoles.admin )//*solo acepta si es un super-user o un admin y esto se envia como metadata
  @UseGuards( AuthGuard(), UserRoleGuard )//*este guard creado por nosotros, se encarga de ver si el usuario tiene los roles necesarios.
  privateRoute2(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      user
    }
  }

  //*similar al anterior end point, usando composicion de decoradores(varios decoradores en uno)
  @Get('private3')
  @Auth( ValidRoles.admin )//*ACÁ SE ENVIAN LOS ROLES
  privateRoute3(
    @GetUser() user: User
  ) {

    return {
      ok: true,
      user
    }
  }



}
