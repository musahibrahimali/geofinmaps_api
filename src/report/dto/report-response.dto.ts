export class ReportResponseDto{
    _id?: string;
    title: string;
    description: string;
    author: string;
    coordinates: {lat:string, lng:string};
    location: string;
    reportType: string;
    createdAt?: Date;
    updatedAt?: Date;
}