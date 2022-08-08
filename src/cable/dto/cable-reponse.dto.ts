export class CableReponseDto{
    _id?: string;
    title: string;
    location: string;
    coord: {lat:string, lng:string};
    details: string;
    createdAt?: Date;
    updatedAt?: Date;
}