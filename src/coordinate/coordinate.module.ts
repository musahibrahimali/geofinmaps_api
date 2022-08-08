import { Module } from '@nestjs/common';
import { CoordinateService } from './coordinate.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Coordinate, CoordinateSchema} from "./schemas/coordinate.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coordinate.name, schema: CoordinateSchema },
    ]),
  ],
  providers: [CoordinateService],
  exports: [CoordinateService],
})
export class CoordinateModule {}
