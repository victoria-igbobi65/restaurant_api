import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { SingleVirtualTrayDto } from './tray.dto';

export class VirtualTraysDto {
  @ValidateNested({ each: true })
  @Type(() => SingleVirtualTrayDto)
  trays: SingleVirtualTrayDto[];
}
