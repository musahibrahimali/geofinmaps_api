export class CreateReportDto{
    title: string;
    description: string;
    author: string;
    coordinates: {lat:string, lng:string};
    location: string;
    reportType: string;
}