import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { EventResponse } from '../../Models/Response/EventResponse';
import { OnlineAgentRequest } from '../../Models/Request/OnlineAgentRequest';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiServerUrl ="http://localhost:9092/agent"

  constructor(private http: HttpClient) { }


  public GetAllevents() : Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.apiServerUrl}/getEvents`);
  }

  public GetOnlineAgent(): Observable<OnlineAgentRequest[]> {
    return this.http.get<OnlineAgentRequest[]>(`http://localhost:9092/api/getOnlineAgent`);
  }

  public AssignEventToAgent(userId : number,eventId : number) {
  return this.http.get(`${this.apiServerUrl}/sendEventtoAgent/${userId}/${eventId}`);
}


}
