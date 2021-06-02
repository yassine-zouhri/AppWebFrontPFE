export class RondeRequest {
    datedebut : Date;
	datefin : Date;
	geofenceradius : number ;
    listUUIDimage : string[];
    listCheckPoint = []
    listdescription : string[]

    constructor(datedebut : Date , datefin : Date , geofenceradius : number,listUUIDimage : string[] , listCheckPoint : any[],listdescription:string[]){
          this.datedebut=datedebut;this.datefin=datefin;this.geofenceradius=geofenceradius;
          this.listUUIDimage =listUUIDimage,this.listCheckPoint=listCheckPoint,this.listdescription=listdescription
        }

  }