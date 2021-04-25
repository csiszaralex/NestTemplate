import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Test')
@Controller('')
export class AppController {
  @Get('homepage')
  test() {
    return [
      {
        id: 1,
        cim: 'Teszt bejegyzés',
        alcim: 'Valami teszt',
        picture: 'https://via.placeholder.com/200',
      },
    ];
  }
}
