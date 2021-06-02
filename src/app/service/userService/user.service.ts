import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { userResponse } from '../../Models/Response/userResponse';
import { SignupRequest } from '../../Models/Request/SignupRequest';
import { UpdateProfileRequest } from '../../Models/Request/UpdateProfileRequest ';
import { FCMuserTokenRequest } from '../../Models/Request/FCMuserTokenRequest';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServerUrl ="http://localhost:9092"

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<userResponse[]> {
    return this.http.get<userResponse[]>(`${this.apiServerUrl}/api/user/allUsers`);
  }

  public addUser(user: SignupRequest)  {
    return this.http.post<SignupRequest>(`${this.apiServerUrl}/api/user/signup`, user);
  }

  /*public updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiServerUrl}/employee/update`, employee);
  }*/

  public deleteEmployee(employeeId: number) {
    return this.http.delete<void>(`${this.apiServerUrl}/api/user/deleteUser/${employeeId}`);
  }

  public UploadImage(uploadImageData : FormData ,uuidImage : string){
    return this.http.post<void>(`${this.apiServerUrl}/api/user/UploadImage/${uuidImage}`,uploadImageData);
  }

  public getUsers1(){
    return new Promise(
      (resolve, reject) => {
        setTimeout(
          () => {
            resolve(this.http.get<userResponse[]>(`${this.apiServerUrl}/api/user/allUsers`));
          }, 1000
        );
      }
    );  
  }

  doesEmailExist(email: string): Observable<boolean> {
    let url = `${this.apiServerUrl}/api/user/emailcheck`;
    let content: any = {};
    content.email = email;
    let response$: Observable<boolean> = this.http.post<boolean>(url, content);
    return response$;
  }

  doesUsernameExist(username: string): Observable<boolean> {
    let url = `${this.apiServerUrl}/api/user/usernamecheck`;
    let content: any = {};
    content.username = username;
    let response$: Observable<boolean> = this.http.post<boolean>(url, content);
    return response$;
  }

  public UpdateProfileUser(user: UpdateProfileRequest)  {
    return this.http.put<UpdateProfileRequest>(`${this.apiServerUrl}/api/user/updateProfileUser`, user);
  }

  public UpdateImageUser(uploadImageData : FormData ,uuidImage : string)  {
    return this.http.put<void>(`${this.apiServerUrl}/api/user/updateImageUser/${uuidImage}`, uploadImageData);
  }

  public getImage(idUser : number) {
    return this.http.get(`${this.apiServerUrl}/api/user/getImage/${idUser}`);
  }

  public getUsersByRoleAgent() {
    return this.http.get(`${this.apiServerUrl}/api/user/getAgenttoAssign`);
  }

  public getUserById(idUser : number){
    return this.http.get(`${this.apiServerUrl}/api/user/agentById/${idUser}`);
  }

  public SendTokenFCM(value : FCMuserTokenRequest){
    return this.http.post<void>(`${this.apiServerUrl}/api/getTokenAppWeb`,value);
  }

  public GetOnlineAgents(){
    return this.http.get(`${this.apiServerUrl}/api/getOnlineAgent`);
  }

  public GetAllAgents(){
    return this.http.get(`${this.apiServerUrl}/api/user/allAgent`);
  }


}
