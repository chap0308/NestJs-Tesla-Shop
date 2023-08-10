import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    //*anterior manera                                //*importamos la variable META_ROLES. // @SetMetadata('roles', ['admin','super-user'])
    // const validRoles: string[] = this.reflector.get( META_ROLES , context.getHandler() )//*el primer argumento es "roles", y lo que se obtiene es la metadata: ['admin','super-user']
    //*ahora usamos el decorador role-protected.decorators.ts para obtener la primera variable (META_ROLES) y la interface valid-roles.ts para obtener la metadata
    const validRoles: string[] = this.reflector.get( META_ROLES , context.getHandler() )
    // console.log(validRoles);//*['admin','super-user']

    //*si no viene ningun rol, entonces lo dejamos pasar. Es decir que si no viene ningun argumento, es porque no es necesario tener un rol para ejecutar esta funcion.
    //!Pero sí necesita de un token válido para ejecutarlo. Para obtener un token, necesitas ser un usuario.
    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;
    //! si no hay ningun rol, entonces ya no obtendriamos el user.
    
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if ( !user ) 
      throw new BadRequestException('User not found');
    
    for (const role of user.roles ) {
      if ( validRoles.includes( role ) ) {
        return true;
      }
    }
    
    throw new ForbiddenException(
      `User ${ user.fullName } need a valid role: [${ validRoles }]`
    );
  }
}
