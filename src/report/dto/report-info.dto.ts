export class ReportInfoDto{
    title: string;
    description: string;
    author: string;
    coordinates: {lat:string, lng:string};
    location: string;
    reportType: string;
}