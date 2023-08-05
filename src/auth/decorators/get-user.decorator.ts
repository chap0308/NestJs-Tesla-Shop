import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';



export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if ( !user )
            throw new InternalServerErrorException('User not found (request)');
        // console.log(data);//*Son los parametros que se envian y con esto podemos hacer validaciones
        //return user;//*muestra el usuario completo
        return ( !data ) ? user : user[data];//*la data viene en string, por eso usamos [] y no .
        
    }
);