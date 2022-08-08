export class UpdateReportDto {
    title: string;
    description: string;
    author: string;
    coordinates: {lat:string, lng:string};
    location: string;
    reportType: string;
}