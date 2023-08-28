import { Body, Controller, Post } from '@nestjs/common';

import { TraysService } from './trays.service';
import { VirtualTraysDto } from './dto/trays.dto';

@Controller('trays')
export class TraysController {
  constructor(private trayService: TraysService) {}

  @Post('total')
  getTraysTotal(@Body() trays: VirtualTraysDto) {
    return this.trayService.calculateTraysTotal(trays.trays);
  }
}
