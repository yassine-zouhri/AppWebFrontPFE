import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { userResponse } from '../../Models/Response/userResponse';
import { SignupRequest } from '../../Models/Request/SignupRequest';
import { UpdateProfileRequest } from '../../Models/Request/UpdateProfileRequest ';
import { RondeRequest } from '../../Models/Request/RondeRequest';
import { RoadMapResponse } from '../../Models/Response/RoadMapResponse';
import { ListRoadsMap } from '../../Models/Request/ListRoadsMap';
import { StatusRoadMap } from '../../Models/Request/StatusRoadMap';

@Injectable({
  providedIn: 'root'
})
export class RondeService {

  private apiServerUrl ="http://localhost:9092/agent"

  constructor(private http: HttpClient) { }

  public AddRoadMap(roadMap : RondeRequest){
    return this.http.post<void>(`${this.apiServerUrl}/addRoadMap`,roadMap);
  }


  public UploadImage(uploadImageData : FormData ,uuidImage : string){
    return this.http.post<void>(`${this.apiServerUrl}/uploadImageCheckPoint/${uuidImage}`,uploadImageData);
  }

  public GetAllRoadMap(): Observable<RoadMapResponse[]> {
    return this.http.get<RoadMapResponse[]>(`${this.apiServerUrl}/getAllRoadMap`);
  }

  public getUUIDimageRoadMap(idRoadmap : number) : Observable<string[]>{
    return this.http.get<string[]>(`${this.apiServerUrl}/getUUIDimageRoadMap/${idRoadmap}`);
  }

  public GetImageByUUID(uuid : string)  {
    return this.http.get(`${this.apiServerUrl}/getImageByUUID/${uuid}`);
  }

  public getListRoadsMap() : Observable<ListRoadsMap[]>{
    return this.http.get<ListRoadsMap[]>(`${this.apiServerUrl}/getListRaodsMap`);
  }

  public AssignRoadMapToAgent(matricule : string , idAgent : number) {
    return this.http.post<void>(`${this.apiServerUrl}/assignAgentToRoadMap/${matricule}/${idAgent}`,null);
  }

  public getStatusRoadMap(idRoadMap : number) : Observable<StatusRoadMap[]>{
    return this.http.get<StatusRoadMap[]>(`${this.apiServerUrl}/getRoadMapStatus/${idRoadMap}`);
  }



}
