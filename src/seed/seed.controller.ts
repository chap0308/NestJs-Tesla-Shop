import { Controller, Get, } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ValidRoles } from '../auth/interfaces';
import { Auth } from '../auth/decorators';

import { SeedService } from './seed.service';


@ApiTags('Seed')//?esto es para la documentacion
@Controller('seed')
// @Auth( ValidRoles.admin )//! Podriamos colocarlo antes de la clase y así todos los endpoints estarían seguros y necesitarian el jwt
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  //*ENDPOINTS:
  @Get()
  // @Auth( ValidRoles.admin )//* para ejecutar en postman, Metodo GET-->Authorization y usar "Bearer Token". Colocamos el token que obtenemos de las funciones create o login;
                              //*le damos send y solo los que tengan rol de admin podrá ejecutar el seed
  executeSeed() {
    return this.seedService.runSeed()
  }
}

