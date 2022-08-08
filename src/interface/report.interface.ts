import { Document } from "mongoose";

interface IReport extends Document {
    readonly _id?: string;
    readonly title: string;
    readonly description: string;
    readonly author: string;
    readonly coordinates: {lat:string, lng:string};
    readonly location: string;
    readonly reportType: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export default IReport;
