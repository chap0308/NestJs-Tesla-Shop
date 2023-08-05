import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';


export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    //?pudimos haber usado el decorador @SetMetadata('roles', ['admin','super-user']), pero usamos el decorador que creamos para validar los roles.

    //*noten la diferencia con el que está en el controller de la ruta private2
    //*los dos son decoradores, pero no se coloca el arroba
    RoleProtected(...roles),//*solo aceptan los roles que se obtienen del parametro y estos son enviados desde el controler. LINEA 81
    //*LA LOGICA VIENE DE UserRoleGuard
    UseGuards( AuthGuard(), UserRoleGuard ),//?TENER EN CUENTA, que si queremos exportar algo debemos saber sus dependencias. En este caso si queremos exportar este decorador,
                                            //?necesitamos exportar el passport en los modulos. auth.module.ts linea 45
  );

}