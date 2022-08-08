import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import mongoose from "mongoose";
import {Type} from "class-transformer";
import {Coordinate} from "../../coordinate/schemas/coordinate.schema";

export type CableModel = Cable & Document;

@Schema({timestamps: true})
export class Cable{
    @IsString()
    @Prop({required: true})
    title: string;

    @IsString()
    @Prop({required: true})
    location: string;

    @Prop({required:true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Coordinate.name }]})
    @Type(() => Coordinate)
    coord: Coordinate;

    @Prop({required: true})
    details: string;
}

export const CableSchema = SchemaFactory.createForClass(Cable);
