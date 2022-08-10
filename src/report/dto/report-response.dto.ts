export class ReportResponseDto{
    _id?: string;
    title: string;
    description: string;
    author: string;
    coordinates: string;
    location: string;
    reportType: string;
    reportDate: Date;
    cable: string;
    createdAt?: Date;
    updatedAt?: Date;
}