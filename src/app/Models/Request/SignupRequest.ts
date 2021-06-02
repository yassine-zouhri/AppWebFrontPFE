import { ThisReceiver } from "@angular/compiler";

export class SignupRequest {
    username: string;
    email:string
    role:string
    password: string;
    firstName:string;
    lastName:string;
    birthDate:Date;
    city:string;
    country:string;
    company:string;
    jobPosition:string;
    mobile:string;
    uuidImage:string;
    actif:boolean;


    constructor(username: string,email:string,role:string,password: string,firstName:string,lastName:string,birthDate:Date,
      city:string,country:string,company:string,jobPosition:string,mobile:string,uuidImage:string,actif:boolean){
        this.username=username;this.email=email;this.role=role;this.password=password;this.firstName=firstName;
        this.lastName=lastName;this.birthDate=birthDate;this.city=city;this.country=country;this.company=company;
        this.jobPosition=jobPosition;this.mobile=mobile;this.uuidImage=uuidImage;this.actif=actif
      }
  }
