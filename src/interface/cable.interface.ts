import { Document } from "mongoose";

interface ICable extends Document {
    readonly _id?: string;
    readonly title: string;
    readonly location: string;
    readonly coord: {lat:string, lng:string};
    readonly details: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export default ICable;
