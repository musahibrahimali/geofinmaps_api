export class CreateCableDto{
    title: string;
    location: string;
    coord: {lat:string, lng:string};
    details: string;
}