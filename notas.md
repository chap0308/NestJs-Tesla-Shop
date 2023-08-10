- docker-compose up -d
- yarn add @nestjs/config
- yarn add @nestjs/typeorm typeorm pg
- yarn add -D @types/multer (CUANDO ES TYPE ES ARCHIVO DE DEFINICION, NO DE PRODUCCION)
- yarn add bcrypt
- yarn add -D @types/bcrypt (RECUERDA LA MAYORIA DE @TYPES SON DE DESARROLLO, POR ESO SE USA -D)

- npm install --save @nestjs/passport passport = yarn add @nestjs/passport passport
- npm install --save @nestjs/jwt passport-jwt = yarn add @nestjs/jwt passport-jwt
- npm install --save-dev @types/passport-jwt = yarn add -D @types/passport-jwt

### el decorador get-user.decorator.ts se creó manualmente
### el decorador raw-headers.decorator.ts se creó manualmente

- nest g gu auth/guards/userRole --no-spec

- nest g d auth/decorators/roleProtected --no-spec --flat

### el decorador auth.decorator.ts se creó manualmente

## IMPORTANTE: SECCION 13-183. IMPORTACION DE DECORADORES CON DEPENDENCIAS

# Documentacion:
- yarn add @nestjs/swagger
y luego colocar en el main:

    const config = new DocumentBuilder()
        .setTitle('Teslo RESTFUL API')
        .setDescription('Teslo shop endpoints')
        .setVersion('1.0')
        // .addTag('cats')//agrupadores
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

# WEB SOCKETS:
- yarn add @nestjs/websockets @nestjs/platform-socket.io

------------------

## EL @PARAM ES LO QUE VA EN UN LA URL, PUEDE SER UN ID O UN VALOR, PERO NORMALMENTE ES UN ":ID". ADEMAS, PUEDE O NO ESTAR EN UN GET, PERO SI EN UN DELETE

## EL @BODY SIEMPRE VIENE EN UN PATCH Y POST

----------------------

## Para obtener el usuario que está conectado, son varias autenticaciones: jwt.strategy.ts, luego user-role.guard y finalmente get-user.decorator.ts