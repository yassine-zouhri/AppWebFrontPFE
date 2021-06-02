export class UpdateProfileRequest  {
    username: string;
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
    actif:boolean;


    constructor(username: string,role:string,password: string,firstName:string,lastName:string,birthDate:Date,
      city:string,country:string,company:string,jobPosition:string,mobile:string,actif:boolean){
        this.username=username;this.role=role;this.password=password;this.firstName=firstName;
        this.lastName=lastName;this.birthDate=birthDate;this.city=city;this.country=country;this.company=company;
        this.jobPosition=jobPosition;this.mobile=mobile;this.actif=actif
      }
  }