import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";

export type CoordinateModel = Coordinate & Document;

@Schema({ timestamps: true })
export class Coordinate {
    @IsString()
    @Prop({ required: true })
    lat: string;

    @IsString()
    @Prop({ required: true })
    lng: string;
}

export const CoordinateSchema = SchemaFactory.createForClass(Coordinate);