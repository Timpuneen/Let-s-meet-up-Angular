import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, EventCreate, EventList } from '../models/event.model';
import { TokenService } from './token';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8000/api/events';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getAccessToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  //all events
  getEvents(): Observable<EventList[]> {
    return this.http.get<any>(`${this.apiUrl}/`).pipe(
      map(response => {
        //response { count, next, previous, results }
        if (response && response.results) {
          console.log('Events from API:', response.results);
          return response.results;
        }
        //massive exception logging
        console.log('Events array:', response);
        return response;
      })
    );
  }

  //event info
  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}/`);
  }

  //new event
  createEvent(event: EventCreate): Observable<Event> {
    console.log('Creating event with data:', event);
    console.log('Location value:', event.location);
    return this.http.post<Event>(`${this.apiUrl}/`, event, {
      headers: this.getHeaders()
    });
  }

  //reg for event
  registerForEvent(id: number): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/${id}/register/`, {}, {
      headers: this.getHeaders()
    });
  }

  //cancel reg
  cancelRegistration(id: number): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/${id}/cancel_registration/`, {}, {
      headers: this.getHeaders()
    });
  }

  //my organized events
  getMyOrganizedEvents(): Observable<EventList[]> {
    return this.http.get<EventList[]>(`${this.apiUrl}/my_organized/`, {
      headers: this.getHeaders()
    });
  }

  //registered on events
  getMyRegisteredEvents(): Observable<EventList[]> {
    return this.http.get<EventList[]>(`${this.apiUrl}/my_registered/`, {
      headers: this.getHeaders()
    });
  }
}