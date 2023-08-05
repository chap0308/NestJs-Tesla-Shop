import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

export const META_ROLES = 'roles';//*acá definimos la metadata y lo exportamos en el guard. De esta manera, solo debemos cambiar acá y no tendremos problemas


export const RoleProtected = (...args: ValidRoles[] ) => {//*solo acepta el tipo ValidRoles[]


    return SetMetadata( META_ROLES , args);
}
